export const RevenueSupportersSql = `with paid_collect_detail as (
    select evt_tx_hash,
        evt_block_time,
        date_trunc('day', to_timestamp(evt_block_time, 'YYYY/MM/DD HH24:MI:ss')) as block_date,
        collector,
        "profileId",
        "pubId",
        "profileId" || '-' || "pubId" as publication_id,
        "rootProfileId",
        "rootPubId",
        "rootProfileId" || '-' || "rootPubId" as root_publication_id,
        '0x' || substring("collectModuleData", 3 + 24, 40) as token_contract_address, -- Start from 3, with 24 of "0" + 40 of address chars
        cast(hex2numeric('0x' || substring("collectModuleData", 3 + 64, 64)) as double precision) as paid_amount
    from lenshub_event_collected
    where length("collectModuleData") > 2 + 64 -- paid collect contains two parts, '0x' + 64 + 64
        and "rootProfileId" = :profile_id
),

paid_follow_detail as (
    select evt_tx_hash,
        evt_block_time,
        date_trunc('day', to_timestamp(evt_block_time, 'YYYY/MM/DD HH24:MI:ss')) as block_date,
        follower,
        "profileIds"[1] as "profileId",
        '0x' || substring("followModuleDatas"[1], 3 + 24, 40) as token_contract_address, -- Start from 3, with 24 of "0" + 40 of address chars
        cast(hex2numeric('0x' || substring("followModuleDatas"[1], 3 + 64, 64)) as double precision) as paid_amount
    from lenshub_event_followed
    where cardinality("followModuleDatas") > 0
        and length("followModuleDatas"[1]) > 2 + 64 -- paid follow contains two parts, 2 + 64 + 64
        and "profileIds" && ARRAY[:profile_id::bigint]
),

paid_transaction_detail_combined as (
    select evt_tx_hash,
        evt_block_time,
        block_date,
        collector as user_address,
        "profileId",
        token_contract_address,
        paid_amount
    from paid_collect_detail
    where token_contract_address <> '0x0000000000000000000000000000000000000000' -- exclude zero address
      and block_date >= date(:startDate)
      and block_date < date(:endDate)
    
    union all 
    
    select evt_tx_hash,
        evt_block_time,
        block_date,
        follower as user_address,
        "profileId",
        token_contract_address,
        paid_amount
    from paid_follow_detail
    where token_contract_address <> '0x0000000000000000000000000000000000000000' -- exclude zero address
      and block_date >= date(:startDate)
      and block_date < date(:endDate)
),

-- Here we use latest price instead of daily avg price to simplify the logic
latest_token_price as (
    select contract_address, symbol, decimals, price, minute
    from (
        select row_number() over (partition by contract_address order by minute desc) as row_num, *
        from price_usd pu
        join coin c on pu.coin_id = c.id
        where contract_address in ( 
                select distinct token_contract_address from paid_transaction_detail_combined 
            )
        order by minute desc
    ) p
    where row_num = 1
    
    union all
    
    select '0xd838290e877e0188a4a44700463419ed96c16107' as contract_address,
        'NCT' as symbol,
        18 as decimals,
        1.69 as price, -- as of date 2023-01-17
        date('2023-01-17') as minute
),

user_consumption_detail as (
    select d.user_address,
        d.evt_tx_hash,
        paid_amount / pow(10, decimals) * price as paid_amount_usd
    from paid_transaction_detail_combined d
    inner join latest_token_price p on d.token_contract_address = p.contract_address
    where token_contract_address <> '0x0000000000000000000000000000000000000000' -- exclude zero address
      and block_date >= date(:startDate)
      and block_date < date(:endDate)
),

-- Include consumption for all users, not matter whether or not users own profile NFT.
user_consumption_summary as (
    select d.user_address,
        sum(paid_amount_usd) as paid_amount_usd
    from user_consumption_detail d
    group by 1
),

profile_burned as (
    select distinct "tokenId" as "profileId"
    from lenshub_event_transfer
    where "to" = '0x0000000000000000000000000000000000000000'
),

-- return the default profile handle for each address
profile_created_with_default_handle as (
    select distinct p.current_owner as owner,
      coalesce(d.handle, p.handle) as handle,
      coalesce(d."profileId", p."profileId") as "profileId"
    from user_consumption_summary s
    inner join lenshub_event_profilecreated p on s.user_address = p.current_owner
    left join lenshub_event_profilecreated d on p.current_owner = d.current_owner and d.is_default is true
    where p."profileId" not in ( select "profileId" from profile_burned )
)

select p.handle,
    p."profileId",
    'Lenster' as link,
    coalesce(trunc(paid_amount_usd::numeric, 2), 0) as "paidAmountUsd",
    user_address as "userAddress"
from user_consumption_summary s
inner join profile_created_with_default_handle p on s.user_address = p.owner
order by paid_amount_usd desc
LIMIT :limit OFFSET :offset;`