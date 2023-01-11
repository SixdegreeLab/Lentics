export const engagementChangeSql = `with content_type(content_type_id, content_type_name, engagement_weight) as (
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

date_series as (
    select generate_series(date(:current_date) - interval '30' day, date(:current_date), '1 day') as block_date
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
    and "rootProfileId" = :profile_id

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

engagement_summary as (
    select c.block_date,
        sum(c.content_count) as content_count,
        cast(sum(c.content_count * ct.engagement_weight) as bigint) as engagement_score
    from content_summary c
    inner join content_type ct on c.content_type_id = ct.content_type_id
    where profile_id = :profile_id
        and c.block_date >= date(:current_date) - interval '30' day
    group by 1
),

engagement_change as (
    select block_date,
        content_count,
        engagement_score,
        lag(content_count, 1) over (order by block_date) as content_count_previous,
        lag(engagement_score, 1) over (order by block_date) as engagement_score_previous,
        content_count - coalesce(lag(content_count, 1) over (order by block_date), content_count) as content_count_change,
        engagement_score - coalesce(lag(engagement_score, 1) over (order by block_date), engagement_score) as engagement_score_change
    from engagement_summary
    order by block_date
),

publication_summary as (
    select block_date,
        sum(content_count) as publication_count
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '30' day
        and content_type_id in (1, 2, 4)    -- Post + Comment + Mirror
    group by 1
),

publication_change as (
    select block_date,
        publication_count,
        lag(publication_count, 1) over (order by block_date) as publication_count_previous,
        publication_count - coalesce(lag(publication_count, 1) over (order by block_date), publication_count) as publication_count_change
    from publication_summary
    order by block_date
),

publication_post_summary as (
    select block_date,
        sum(content_count) as publication_count
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '30' day
        and content_type_id in (1)    -- Post
    group by 1
),

publication_post_change as (
    select block_date,
        publication_count
    from publication_post_summary
    order by block_date
),

publication_comment_summary as (
    select block_date,
        sum(content_count) as publication_count
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '30' day
        and content_type_id in (2)    -- Comment
    group by 1
),

publication_comment_change as (
    select block_date,
        publication_count
    from publication_comment_summary
    order by block_date
),

publication_mirror_summary as (
    select block_date,
        sum(content_count) as publication_count
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '30' day
        and content_type_id in (4)    -- Mirror
    group by 1
),

publication_mirror_change as (
    select block_date,
        publication_count
    from publication_mirror_summary
    order by block_date
),

follower_summary as (
    select block_date,
        sum(content_count) as follower_count
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '30' day
        and content_type_id in (9)    -- Followed
    group by 1
),

follower_change as (
    select block_date,
        follower_count,
        lag(follower_count, 1) over (order by block_date) as follower_count_previous,
        follower_count - coalesce(lag(follower_count, 1) over (order by block_date), follower_count) as follower_count_change
    from follower_summary
    order by block_date
),

commented_summary as (
    select block_date,
        sum(content_count) as commented_count
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '30' day
        and content_type_id in (3)    -- Commented
    group by 1
),

commented_change as (
    select block_date,
        commented_count,
        lag(commented_count, 1) over (order by block_date) as commented_count_previous,
        commented_count - coalesce(lag(commented_count, 1) over (order by block_date), commented_count) as commented_count_change
    from commented_summary
    order by block_date
),

mirrored_summary as (
    select block_date,
        sum(content_count) as mirrored_count
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '30' day
        and content_type_id in (5)    -- Mirrored
    group by 1
),

mirrored_change as (
    select block_date,
        mirrored_count,
        lag(mirrored_count, 1) over (order by block_date) as mirrored_count_previous,
        mirrored_count - coalesce(lag(mirrored_count, 1) over (order by block_date), mirrored_count) as mirrored_count_change
    from mirrored_summary
    order by block_date
),

collected_summary as (
    select block_date,
        sum(content_count) as collected_count
    from content_summary
    where profile_id = :profile_id
        and block_date >= date(:current_date) - interval '30' day
        and content_type_id in (7)    -- Collected
    group by 1
),

collected_change as (
    select block_date,
        collected_count,
        lag(collected_count, 1) over (order by block_date) as collected_count_previous,
        collected_count - coalesce(lag(collected_count, 1) over (order by block_date), collected_count) as collected_count_change
    from collected_summary
    order by block_date
)

select :profile_id as "profileId",
    to_char(d.block_date, 'YYYY-MM-DD') as "blockDate",
    coalesce(e.content_count, 0) as "contentCountChange",
    coalesce(e.engagement_score, 0) as "engagementScoreChange",
    coalesce(p.publication_count, 0) as "publicationCountChange",
    coalesce(ppc.publication_count, 0) as "publicationPostCountChange",
    coalesce(pcc.publication_count, 0) as "publicationCommentCountChange",
    coalesce(pmc.publication_count, 0) as "publicationMirrorCountChange",
    coalesce(f.follower_count, 0) as "followerCountChange",
    coalesce(c.commented_count, 0) as "commentedCountChange",
    coalesce(m.mirrored_count, 0) as "mirroredCountChange",
    coalesce(cl.collected_count, 0) as "collectedCountChange"
from date_series d
left join engagement_change e on d.block_date = e.block_date
left join publication_change p on d.block_date = p.block_date
left join publication_post_change ppc on d.block_date = ppc.block_date
left join publication_comment_change pcc on d.block_date = pcc.block_date
left join publication_mirror_change pmc on d.block_date = pmc.block_date
left join follower_change f on d.block_date = f.block_date
left join commented_change c on d.block_date = c.block_date
left join mirrored_change m on d.block_date = m.block_date
left join collected_change cl on d.block_date = cl.block_date
order by d.block_date;
`;