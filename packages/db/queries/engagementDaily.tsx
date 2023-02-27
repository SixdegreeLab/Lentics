export const engagementDailySql = `with content_type(content_type_id, content_type_name, engagement_weight) as (
    values 
    (1, 'Post', 10.0),
    (2, 'Comment', 6.0),
    (3, 'Commented', 3.0),
    (4, 'Mirror', 5.0),
    (5, 'Mirrored', 3.0),
    (6, 'Collect', 3.0),
    (7, 'Collected', 2.0),
    (8, 'Follow', 3.0),
    (9, 'Followed', 2.0),
    (10, 'Mention', 1.0),
    (11, 'Mentioned', 0.5),
    (12, 'Like', 1.0),
    (13, 'Liked', 0.5)
),

content_detail as (
    select evt_block_time,
      "profileId" as profile_id,
      1 as content_type_id
    from lenshub_event_postcreated
    where "profileId" = :profile_id

    union all

    select evt_block_time,
      "profileId" as profile_id,
      2 as content_type_id
    from lenshub_event_commentcreated
    where "profileId" = :profile_id

    union all

    select evt_block_time,
      "profileIdPointed" as profile_id,
      3 as content_type_id
    from lenshub_event_commentcreated
    where "profileIdPointed" = :profile_id

    union all

    select evt_block_time,
      "profileId" as profile_id,
      4 as content_type_id
    from lenshub_event_mirrorcreated
    where "profileId" = :profile_id

    union all

    select evt_block_time,
      "profileIdPointed" as profile_id,
      5 as content_type_id
    from lenshub_event_mirrorcreated
    where "profileIdPointed" = :profile_id

    union all

    select c.evt_block_time,
      p."profileId" as profile_id,
      6 as content_type_id
    from lenshub_event_collected c
    inner join lenshub_event_profilecreated p on c.collector = p."current_owner"
    where p."profileId" = :profile_id

    union all

    select evt_block_time,
      "profileId" as profile_id,
      7 as content_type_id
    from lenshub_event_collected
    where "profileId" = :profile_id

    union all

    select evt_block_time,
      "rootProfileId" as profile_id,
      7 as content_type_id
    from lenshub_event_collected
    where "profileId" <> "rootProfileId"
    and "rootProfileId" = :profile_id

    union all

    select f.evt_block_time,
      p."profileId" as profile_id,
      8 as content_type_id
    from lenshub_event_followed f
    inner join lenshub_event_profilecreated p on f.follower = p."current_owner"
    cross join unnest("profileIds") as tbl(profile_id)
    where p."profileId" = :profile_id

    union all

    select f.evt_block_time,
      tbl.profile_id as profile_id,
      9 as content_type_id
    from lenshub_event_followed f
    cross join unnest("profileIds") as tbl(profile_id)
    where f."profileIds" && ARRAY[:profile_id::bigint]

    --TODO: Liked and Mentioned
),

content_summary as (
    select content_type_id,
      date_trunc('day', to_timestamp(evt_block_time, 'YYYY/MM/DD HH24:MI:ss')) as block_date,
      profile_id,
      count(*) as content_count
    from content_detail
    group by 1, 2,3
)

-- daily
select c.content_type_id as "contentTypeId",
    ct.content_type_name as "contentTypeName",
    to_char(c.block_date, 'YYYY-MM-DD') as "blockDate",
    c.profile_id as "profileId",
    c.content_count as "contentCount",
    cast(c.content_count * ct.engagement_weight as bigint) as "engagementScore"
from content_summary c
inner join content_type ct on c.content_type_id = ct.content_type_id
where profile_id = :profile_id
order by c.block_date, c.content_type_id;
`;