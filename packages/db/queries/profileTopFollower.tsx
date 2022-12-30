export const profileTopFollowerSql = `with date_filter as (
    with start_date_info as (
        select date_trunc('month', date(:date_of_month)) as start_date
    )
    
    select start_date,
        start_date + interval '1' month as end_date
    from start_date_info
),

-- profiles with real owner
profile_created as (
    select distinct p.handle,
        p."profileId" as profile_id,
        p.evt_tx_hash,
        p.evt_block_time,
        first_value(t."to") over (partition by t."tokenId" order by t.evt_block_time desc) as owner -- last transfer to is owner
    from lenshub_event_profilecreated p
    inner join lenshub_event_transfer t on p."profileId" = t."tokenId"
),

-- profiles with real followers
profile_followers as (
    select distinct "profileId" as profile_id,
        "followNFTId" as follow_nft_id,
        first_value(evt_block_time) over (partition by "profileId", "followNFTId" order by evt_block_time desc) as evt_block_time,
        first_value(evt_tx_hash)  over (partition by "profileId", "followNFTId" order by evt_block_time desc) as evt_tx_hash,
        first_value("to")  over (partition by "profileId", "followNFTId" order by evt_block_time desc) as follower
    from lenshub_event_follownfttransferred
),

current_profile_new_followers as (
    select f.*,
        p.profile_id as follower_profile_id,
        p.handle as follower_profile_handle
    from profile_followers f
    inner join profile_created p on f.follower = p.owner    -- filter only followers who have profiles
\tinner join date_filter df on true
    where f.profile_id = :profile_id
        and to_timestamp(f.evt_block_time, 'YYYY/MM/DD HH24:MI:ss') >= df.start_date
        and to_timestamp(f.evt_block_time, 'YYYY/MM/DD HH24:MI:ss') < df.end_date
        and f.follower <> '0x0000000000000000000000000000000000000000'
),

top_follower as (
    select c.follower_profile_id,
        c.follower_profile_handle,
        count(*) as follower_profile_followers_count
    from current_profile_new_followers c
    inner join profile_followers f on c.follower_profile_id = f.profile_id
    where f.follower <> '0x0000000000000000000000000000000000000000'
    group by 1, 2
    order by 3 desc
    limit 1
),

top_follower_following_summary as (
    select count(f.profile_id) as top_follower_following_count
    from top_follower t
    inner join profile_created p on t.follower_profile_id = p.profile_id
    inner join profile_followers f on p.owner = f.follower
    where p.owner <> '0x0000000000000000000000000000000000000000'
)

select follower_profile_id as "followerProfileId",
    follower_profile_handle as "followerProfileHandle",
    follower_profile_followers_count as "followerProfileFollowersCount",
    top_follower_following_count as "topFollowerFollowingCount"
from top_follower
inner join top_follower_following_summary on true;
`;