/* 
  Follower count is used to get top follower, following is no longer used.
  Fetch them from lens api on the client.
*/
export const profileTopFollowerSql = `with date_filter as (
    select date(:startDate) as start_date, date(:endDate) as end_date
),

profile_followers as (
  select f."profileId" as profile_id,
          f."followNFTId" as follow_nft_id,
          f.evt_block_time,
          f."to" as follower
  from (
     select "profileId",
       "followNFTId",
       evt_block_time,
       "to"
     from lenshub_event_follownfttransferred
     where "profileId" = :profile_id
  ) f
  inner join (
     select "profileId",
       "followNFTId",
       max(evt_block_time) as evt_block_time 
     from lenshub_event_follownfttransferred
     where "profileId" = :profile_id
     group by 1, 2
  ) as d on d.evt_block_time = f.evt_block_time
    and d."profileId" = f."profileId"
    and d."followNFTId" = f."followNFTId"
),

-- return the default profile handle for each address
profile_created_with_default_handle as (
    select distinct p.current_owner as current_owner,
      coalesce(d.handle, p.handle) as handle,
      coalesce(d."profileId", p."profileId") as "profileId",
      p.follower,
      p.following
    from profile_followers f
    inner join lenshub_event_profilecreated p on f.follower = p.current_owner
    left join lenshub_event_profilecreated d on p.current_owner = d.current_owner and d.is_default is true
    where p.current_owner <> '0x0000000000000000000000000000000000000000'
),

current_profile_new_followers as (
    select p."profileId" as follower_profile_id,
        p.handle as follower_profile_handle,
        f.follower,
        p.follower as follower_profile_followers_count,
        p.following as follower_profile_following_count
    from profile_followers f
    inner join profile_created_with_default_handle p on f.follower = p.current_owner -- filter only followers who have profiles
    inner join date_filter df on true
    where to_timestamp(f.evt_block_time, 'YYYY/MM/DD HH24:MI:ss') >= df.start_date
        and to_timestamp(f.evt_block_time, 'YYYY/MM/DD HH24:MI:ss') < df.end_date
        and f.follower <> '0x0000000000000000000000000000000000000000'
),

-- Just count issued nft
top_follower as (
    select c.follower_profile_id,
        c.follower_profile_handle,
        follower_profile_followers_count,
        follower_profile_following_count
    from current_profile_new_followers c
    order by 3 desc
    limit 1
)

select follower_profile_id as "followerProfileId",
    follower_profile_handle as "followerProfileHandle",
    follower_profile_followers_count as "followerProfileFollowersCount",
    follower_profile_following_count as "topFollowerFollowingCount"
from top_follower;`;
