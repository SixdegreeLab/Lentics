export const topEngagementPostsSql = `with content_type(content_type_id, content_type_name, engagement_weight) as (
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

date_filter as (
    select date(:startDate) as start_date, date(:endDate) as end_date
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
      "profileIdPointed" as profile_id,
      "pubIdPointed" as publication_id,
      3 as content_type_id
    from lenshub_event_commentcreated
    inner join date_filter on true
    where "profileIdPointed" = :profile_id
    and evt_block_time >= TO_CHAR(date_filter.start_date, 'YYYY/MM/DD HH24:MI:ss')
    and evt_block_time < TO_CHAR(date_filter.end_date, 'YYYY/MM/DD HH24:MI:ss')

    union all

    select evt_block_time,
      "profileIdPointed" as profile_id,
      "pubIdPointed" as publication_id,
      5 as content_type_id
    from lenshub_event_mirrorcreated
    inner join date_filter on true
    where "profileIdPointed" = :profile_id
    and evt_block_time >= TO_CHAR(date_filter.start_date, 'YYYY/MM/DD HH24:MI:ss')
    and evt_block_time < TO_CHAR(date_filter.end_date, 'YYYY/MM/DD HH24:MI:ss')

    union all

    select evt_block_time,
      "profileId" as profile_id,
      "pubId" as publication_id,
      7 as content_type_id
    from lenshub_event_collected
    inner join date_filter on true
    where "profileId" = :profile_id
    and evt_block_time >= TO_CHAR(date_filter.start_date, 'YYYY/MM/DD HH24:MI:ss')
    and evt_block_time < TO_CHAR(date_filter.end_date, 'YYYY/MM/DD HH24:MI:ss')

    union all

    select evt_block_time,
      "rootProfileId" as profile_id,
      "rootPubId" as publication_id,
      7 as content_type_id
    from lenshub_event_collected
    inner join date_filter on true
    where "profileId" <> "rootProfileId"
    and "rootProfileId" = :profile_id
    and evt_block_time >= TO_CHAR(date_filter.start_date, 'YYYY/MM/DD HH24:MI:ss')
    and evt_block_time < TO_CHAR(date_filter.end_date, 'YYYY/MM/DD HH24:MI:ss')
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
    select c.publication_id as "topPostId",
        p.content_uri as "topPostContentUri",
        cast(sum(c.content_count * ct.engagement_weight) as bigint) as "topPostEngagementScore"
    from content_detail_summary c
    inner join content_type ct on c.content_type_id = ct.content_type_id
    inner join post_created p on c.publication_id = p.post_id
    where c.content_type_id in (3, 5, 7) -- Commented + Mirrored + Collected
    group by 1, 2
    order by 3 desc
)

select *
from top_engagement
LIMIT :limit OFFSET :offset;
`;

export const topCollectedPostsSql = `with content_type(content_type_id, content_type_name, engagement_weight) as (
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

date_filter as (
    select date(:startDate) as start_date, date(:endDate) as end_date
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
      7 as content_type_id
    from lenshub_event_collected
    inner join date_filter on true
    where "profileId" = :profile_id
    and evt_block_time >= TO_CHAR(date_filter.start_date, 'YYYY/MM/DD HH24:MI:ss')
    and evt_block_time < TO_CHAR(date_filter.end_date, 'YYYY/MM/DD HH24:MI:ss')

    union all

    select evt_block_time,
      "rootProfileId" as profile_id,
      "rootPubId" as publication_id,
      7 as content_type_id
    from lenshub_event_collected
    inner join date_filter on true
    where "profileId" <> "rootProfileId"
    and "rootProfileId" = :profile_id
    and evt_block_time >= TO_CHAR(date_filter.start_date, 'YYYY/MM/DD HH24:MI:ss')
    and evt_block_time < TO_CHAR(date_filter.end_date, 'YYYY/MM/DD HH24:MI:ss')
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

top_collected as (
    select c.publication_id as "topPostId",
        p.content_uri as "topPostContentUri",
        c.content_count as top_post_count        
    from content_detail_summary c
    inner join post_created p on c.publication_id = p.post_id
    where c.content_type_id = 7 -- Collected
    order by 3 desc
)

select *
from top_collected
LIMIT :limit OFFSET :offset;
`
