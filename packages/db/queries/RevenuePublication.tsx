export const RevenuePublicationSql = `with paid_collect_detail as (
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
        and date_trunc('day', to_timestamp(evt_block_time, 'YYYY/MM/DD HH24:MI:ss')) >= date(:startDate)
        and date_trunc('day', to_timestamp(evt_block_time, 'YYYY/MM/DD HH24:MI:ss')) < date(:endDate)
),

-- Here we use latest price instead of daily avg price to simplify the logic
latest_token_price as (
    select contract_address, symbol, decimals, price, minute
    from (
        select row_number() over (partition by contract_address order by minute desc) as row_num, *
        from price_usd pu
        join coin c on pu.coin_id = c.id
        where contract_address in ( 
                select distinct token_contract_address from paid_collect_detail 
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

revenue_summary as (
    select "rootProfileId" as "profileId",
        "rootPubId" as "pubId",
        root_publication_id as publication_id,
        sum(paid_amount / pow(10, decimals) * price) as paid_amount_usd,
        count(evt_tx_hash) as transaction_count
    from paid_collect_detail d
    inner join latest_token_price p on d.token_contract_address = p.contract_address
    group by 1, 2, 3
),

revenue_post_supporters as (
    select root_publication_id as publication_id,
        count(d.collector) as consumer_count
    from paid_collect_detail d
    inner join latest_token_price p on d.token_contract_address = p.contract_address
    group by 1
),

profile_burned as (
    select distinct "tokenId" as "profileId"
    from lenshub_event_transfer
    where "to" = '0x0000000000000000000000000000000000000000'
),

top_posts as (
    select r."profileId",
        r."pubId",
        r.publication_id,
        to_hex(r."profileId") as hex_profile_id,
        to_hex(r."pubId") as hex_pub_id,
        p.handle,
        trunc(r.paid_amount_usd::numeric, 2) as paid_amount_usd,
        rs.consumer_count as consumer_count
    from revenue_summary r
    inner join lenshub_event_profilecreated p on r."profileId" = p."profileId"
    left join revenue_post_supporters rs on r.publication_id = rs.publication_id
    where p."profileId" not in ( select "profileId" from profile_burned )
    order by r.paid_amount_usd desc
)

select concat(
      (case when length(hex_profile_id) % 2 = 0 then '0x' || hex_profile_id else '0x0' || hex_profile_id end),
      '-',
      (case when length(hex_pub_id) % 2 = 0 then '0x' || hex_pub_id else '0x0' || hex_pub_id end)
    ) as "publicationId",
    "profileId",
    "pubId",
    coalesce(paid_amount_usd, 0) as "paidAmountUsd",
    coalesce(consumer_count, 0) as "supporterCount"
from top_posts
where paid_amount_usd > 0 -- Filter off the row that amount less than 0.01 dollars
order by paid_amount_usd desc
LIMIT :limit OFFSET :offset;`