export const engagementMonthlySql = `with date_filter as (
    with start_date_info as (
        select date_trunc('month', date(:date_of_month)) as start_date
    )
    
    select start_date,
        start_date + interval '1' month as end_date
    from start_date_info
),

content_type(content_type_id, content_type_name, engagement_weight) as (
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

post_created as (
    select evt_block_time,
      "profileId" as profile_id,
      "pubId" as post_id,
      "contentURI" as content_uri,
      evt_tx_hash
    from lenshub_event_postcreated p
    inner join date_filter df on true
    where "profileId" = :profile_id
        and to_timestamp(p.evt_block_time, 'YYYY/MM/DD HH24:MI:ss') >= df.start_date
        and to_timestamp(p.evt_block_time, 'YYYY/MM/DD HH24:MI:ss') < df.end_date
),

content_detail as (
    select evt_block_time,
      "profileId" as profile_id,
      "pubId" as publication_id,
      1 as content_type_id
    from lenshub_event_postcreated

    union all

    select evt_block_time,
      "profileId" as profile_id,
      "pubId" as publication_id,
      2 as content_type_id
    from lenshub_event_commentcreated

    union all

    select evt_block_time,
      "profileIdPointed" as profile_id,
      "pubIdPointed" as publication_id,
      3 as content_type_id
    from lenshub_event_commentcreated

    union all

    select evt_block_time,
      "profileId" as profile_id,
      "pubId" as publication_id,
      4 as content_type_id
    from lenshub_event_mirrorcreated

    union all

    select evt_block_time,
      "profileIdPointed" as profile_id,
      "pubIdPointed" as publication_id,
      5 as content_type_id
    from lenshub_event_mirrorcreated

    union all

    select c.evt_block_time,
      p."profileId" as profile_id,
      '0' as publication_id,
      6 as content_type_id
    from lenshub_event_collected c
    inner join lenshub_event_profilecreated p on c.collector = p."to"

    union all

    select evt_block_time,
      "profileId" as profile_id,
      "pubId" as publication_id,
      7 as content_type_id
    from lenshub_event_collected

    union all

    select evt_block_time,
      "rootProfileId" as profile_id,
      "rootPubId" as publication_id,
      7 as content_type_id
    from lenshub_event_collected
    where "profileId" <> "rootProfileId"

    union all

    select f.evt_block_time,
      p."profileId" as profile_id,
      '0' as publication_id,
      8 as content_type_id
    from lenshub_event_followed f
    inner join lenshub_event_profilecreated p on f.follower = p."to"
    cross join unnest("profileIds") as tbl(profile_id)

    union all

    select f.evt_block_time,
      tbl.profile_id as profile_id,
      '0' as publication_id,
      9 as content_type_id
    from lenshub_event_followed f
    cross join unnest("profileIds") as tbl(profile_id)

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
    select sum(c.content_count) as content_count,
        cast(sum(c.content_count * ct.engagement_weight) as bigint) as engagement_score
    from content_summary c
    inner join content_type ct on c.content_type_id = ct.content_type_id
    inner join date_filter df on true
    where profile_id = :profile_id
        and c.block_date >= df.start_date and c.block_date < df.end_date
),

publication_summary as (
    select sum(content_count) as publication_count
    from content_summary c
    inner join date_filter df on true
    where profile_id = :profile_id
        and c.block_date >= df.start_date and c.block_date < df.end_date
        and content_type_id in (1, 2, 4)    -- Post + Comment + Mirror
),

follower_summary as (
    select sum(content_count) as follower_count
    from content_summary c
    inner join date_filter df on true
    where profile_id = :profile_id
        and c.block_date >= df.start_date and c.block_date < df.end_date
        and content_type_id in (9)    -- Followed
),

commented_summary as (
    select sum(content_count) as commented_count
    from content_summary c
    inner join date_filter df on true
    where profile_id = :profile_id
        and c.block_date >= df.start_date and c.block_date < df.end_date
        and content_type_id in (3)    -- Commented
),

mirrored_summary as (
    select sum(content_count) as mirrored_count
    from content_summary c
    inner join date_filter df on true
    where profile_id = :profile_id
        and c.block_date >= df.start_date and c.block_date < df.end_date
        and content_type_id in (5)    -- Mirrored
),

collected_summary as (
    select sum(content_count) as collected_count
    from content_summary c
    inner join date_filter df on true
    where profile_id = :profile_id
        and c.block_date >= df.start_date and c.block_date < df.end_date
        and content_type_id in (7)    -- Collected
),

content_detail_summary as (
    select publication_id,
        content_type_id,
        count(*) as content_count
    from content_detail c
    inner join date_filter df on true
    where profile_id = :profile_id
        and to_timestamp(c.evt_block_time, 'YYYY/MM/DD HH24:MI:ss') >= df.start_date
        and to_timestamp(c.evt_block_time, 'YYYY/MM/DD HH24:MI:ss') < df.end_date
    group by 1, 2
),

top_engagement as (
    select c.publication_id as top_engagement_post_id,
        p.content_uri as top_engagement_post_content_uri,
        cast(sum(c.content_count * ct.engagement_weight) as bigint) as top_post_engagement_score
    from content_detail_summary c
    inner join content_type ct on c.content_type_id = ct.content_type_id
    inner join post_created p on c.publication_id = p.post_id
    where c.content_type_id in (3, 5, 7) -- Commented + Mirrored + Collected
    group by 1, 2
    order by 3 desc
    limit 1
),

top_commented as (
    select c.publication_id as top_commented_post_id,
        c.content_count as top_post_commented_count,
        p.content_uri as top_commented_post_content_uri
    from content_detail_summary c
    inner join post_created p on c.publication_id = p.post_id
    where c.content_type_id in (3) -- Commented
    order by 2 desc
    limit 1
),

top_mirrored as (
    select c.publication_id as top_mirrored_post_id,
        c.content_count as top_post_mirrored_count,
        p.content_uri as top_mirrored_post_content_uri
    from content_detail_summary c
    inner join post_created p on c.publication_id = p.post_id
    where c.content_type_id in (5) -- Mirrored
    order by 2 desc
    limit 1
),

top_collected as (
    select c.publication_id as top_collected_post_id,
        c.content_count as top_post_collected_count,
        p.content_uri as top_collected_post_content_uri
    from content_detail_summary c
    inner join post_created p on c.publication_id = p.post_id
    where c.content_type_id in (7) -- Collected
    order by 2 desc
    limit 1
)

select :profile_id as "profileId",
    start_date as "startDate",
    content_count as "contentCount",
    engagement_score as "engagementScore",
    publication_count as "publicationCount",
    follower_count as "followerCount",
    commented_count as "commentedCount",
    mirrored_count as "mirroredCount",
    collected_count as "collectedCount",
    top_engagement_post_id as "topEngagementPostId",
    top_post_engagement_score as "topPostEngagementScore",
    top_engagement_post_content_uri as "topEngagementPostContentUri",
    top_commented_post_id as "topCommentedPostId",
    top_post_commented_count as "topPostCommentedCount",
    top_commented_post_content_uri as "topCommentedPostContentUri",
    top_mirrored_post_id as "topMirroredPostId",
    top_post_mirrored_count as "topPostMirroredCount",
    top_mirrored_post_content_uri as "topMirroredPostContentUri",
    top_collected_post_id as "topCollectedPostId",
    top_post_collected_count as "topPostCollectedCount",
    top_collected_post_content_uri as "topCollectedPostContentUri"
from engagement_summary
inner join date_filter on true
inner join publication_summary on true
inner join follower_summary on true
inner join commented_summary on true
inner join mirrored_summary on true
inner join collected_summary on true
inner join top_engagement on true
inner join top_commented on true
inner join top_mirrored on true
inner join top_collected on true;
`;