export const engagementCounterSql = `with content_type(content_type_id, content_type_name, engagement_weight) as (
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
    inner join lenshub_event_profilecreated p on c.collector = p."to"
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
    AND "rootProfileId" = :profile_id

    union all

    select f.evt_block_time,
      p."profileId" as profile_id,
      8 as content_type_id
    from lenshub_event_followed f
    inner join lenshub_event_profilecreated p on f.follower = p."to"
    cross join unnest("profileIds") as tbl(profile_id)
    where p."profileId" = :profile_id

    union all

    select f.evt_block_time,
      tbl.profile_id as profile_id,
      9 as content_type_id
    from lenshub_event_followed f
    cross join unnest("profileIds") as tbl(profile_id)
    where tbl.profile_id = :profile_id

    --TODO: Liked and Mentioned
),

content_summary as (
    select content_type_id,
      date_trunc('day', to_timestamp(evt_block_time, 'YYYY/MM/DD HH24:MI:ss')) as block_date,
      profile_id,
      count(*) as content_count
    from content_detail
    group by 1, 2,3
),

engagement_summary_current as (
    select sum(c.content_count) as content_count_current,
        cast(sum(c.content_count * ct.engagement_weight) as bigint) as engagement_score_current
    from content_summary c
    inner join content_type ct on c.content_type_id = ct.content_type_id
    where profile_id = :profile_id
        and c.block_date >= date(:current_date) - interval '30' day
),

engagement_summary_previous as (
    select sum(c.content_count) as content_count_previous,
        cast(sum(c.content_count * ct.engagement_weight) as bigint) as engagement_score_previous
    from content_summary c
    inner join content_type ct on c.content_type_id = ct.content_type_id
    where profile_id = :profile_id
        and c.block_date >= date(:current_date) - interval '60' day
        and c.block_date < date(:current_date) - interval '30' day
),

publication_summary_current as (
    select sum(content_count) as publication_count_current
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '30' day
        and content_type_id in (1, 2, 4)    -- Post + Comment + Mirror
),

publication_summary_previous as (
    select sum(content_count) as publication_count_previous
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '60' day
        and block_date < date(:current_date) - interval '30' day
        and content_type_id in (1, 2, 4)    -- Post + Comment + Mirror
),

follower_summary_current as (
    select sum(content_count) as follower_count_current
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '30' day
        and content_type_id in (9)    -- Followed
),

follower_summary_previous as (
    select sum(content_count) as follower_count_previous
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '60' day
        and block_date < date(:current_date) - interval '30' day
        and content_type_id in (9)    -- Followed
),

commented_summary_current as (
    select sum(content_count) as commented_count_current
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '30' day
        and content_type_id in (3)    -- Commented
),

commented_summary_previous as (
    select sum(content_count) as commented_count_previous
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '60' day
        and block_date < date(:current_date) - interval '30' day
        and content_type_id in (3)    -- Commented
),

mirrored_summary_current as (
    select sum(content_count) as mirrored_count_current
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '30' day
        and content_type_id in (5)    -- Mirrored
),

mirrored_summary_previous as (
    select sum(content_count) as mirrored_count_previous
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '60' day
        and block_date < date(:current_date) - interval '30' day
        and content_type_id in (5)    -- Mirrored
),

collected_summary_current as (
    select sum(content_count) as collected_count_current
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '30' day
        and content_type_id in (7)    -- Collected
),

collected_summary_previous as (
    select sum(content_count) as collected_count_previous
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '60' day
        and block_date < date(:current_date) - interval '30' day
        and content_type_id in (7)    -- Collected
)

select :profile_id as "profileId",
    coalesce(content_count_current, 0) as "contentCountCurrent",
    coalesce(content_count_previous, 0) as "contentCountPrevious",
    coalesce(content_count_current - content_count_previous, 0) as "contentCountChange",
    coalesce(cast(content_count_current - content_count_previous as double precision) / content_count_previous * 100.0, 0) as "contentCountChangePercentage",
    
    coalesce(engagement_score_current, 0) as "engagementScoreCurrent",
    coalesce(engagement_score_previous, 0) as "engagementScorePrevious",
    coalesce(engagement_score_current - engagement_score_previous, 0) as "engagementScoreChangeValue",
    coalesce(cast(engagement_score_current - engagement_score_previous as double precision) / engagement_score_previous * 100.0, 0) as "engagementScoreChangePercentage",

    coalesce(publication_count_current, 0) as "publicationCountCurrent",
    coalesce(publication_count_previous, 0) as "publicationCountPrevious",
    coalesce(publication_count_current - publication_count_previous, 0) as "publicationCountChange",
    coalesce(cast(publication_count_current - publication_count_previous as double precision) / publication_count_previous * 100.0, 0) as "publicationCountChangePercentage",

    coalesce(follower_count_current, 0) as "followerCountCurrent",
    coalesce(follower_count_previous, 0) as "followerCountPrevious",
    coalesce(follower_count_current - follower_count_previous, 0) as "followerCountChange",
    coalesce(cast(follower_count_current - follower_count_previous as double precision) / follower_count_previous * 100.0, 0) as "followerCountChangePercentage",

    coalesce(commented_count_current, 0) as "commentedCountCurrent",
    coalesce(commented_count_previous, 0) as "commentedCountPrevious",
    coalesce(commented_count_current - commented_count_previous, 0) as "commentedCountChange",
    coalesce(cast(commented_count_current - commented_count_previous as double precision) / commented_count_previous * 100.0, 0) as "commentedCountChangePercentage",

    coalesce(mirrored_count_current, 0) as "mirroredCountCurrent",
    coalesce(mirrored_count_previous, 0) as "mirroredCountPrevious",
    coalesce(mirrored_count_current - mirrored_count_previous, 0) as "mirroredCountChange",
    coalesce(cast(mirrored_count_current - mirrored_count_previous as double precision) / mirrored_count_previous * 100.0, 0) as "mirroredCountChangePercentage",

    coalesce(collected_count_current, 0) as "collectedCountCurrent",
    coalesce(collected_count_previous, 0) as "collectedCountPrevious",
    coalesce(collected_count_current - collected_count_previous, 0) as "collectedCountChange",
    coalesce(cast(collected_count_current - collected_count_previous as double precision) / collected_count_previous * 100.0, 0) as "collectedCountChangePercentage"
from engagement_summary_current
inner join engagement_summary_previous on true
inner join publication_summary_current on true
inner join publication_summary_previous on true
inner join follower_summary_current on true
inner join follower_summary_previous on true
inner join commented_summary_current on true
inner join commented_summary_previous on true
inner join mirrored_summary_current on true
inner join mirrored_summary_previous on true
inner join collected_summary_current on true
inner join collected_summary_previous on true;
`;