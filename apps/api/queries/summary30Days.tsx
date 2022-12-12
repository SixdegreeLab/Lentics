const summary30DaysSql = `with post_summary as (
  select count(*) as post_count
  from lenshub_event_postcreated
  where "profileId" = :profile_id
),

comment_summary as (
  select count(*) as comment_count
  from lenshub_event_postcreated
  where "profileId" = :profile_id
),

mirror_summary as (
  select count(*) as mirror_count
  from lenshub_event_mirrorcreated
  where "profileId" = :profile_id
),

follower_summary as (
  select count(*) as follower_count
    from lenshub_event_followed
    where "profileIds" = :profile_id
),

collect_summary as (
  select count(*) as collect_count
  from lenshub_event_collected
  where "profileId" = :profile_id
),

revenue_summary as (
  select 1234.56 as revenue_amount	-- todo fake data
)

select 29617 as "profileId",
  (post_count + comment_count + mirror_count + 1200) as "engagementCount", -- TODO
  (post_count + comment_count + mirror_count) as "publicationCount",
  follower_count as "followerCount",
  collect_count as "collectCount",
  revenue_amount as "revenueAmount",
  -- todo fake data
  ((post_count + comment_count + mirror_count + 1200) * 0.50)::integer as "engagementChangeCount", -- TODO
  (post_count + comment_count + mirror_count) * 0.10 as "publicationChangeCount",
  (follower_count * 0.20)::integer as "followerChangeCount",
  (collect_count * 0.10)::integer as "collectChangeCount",
  revenue_amount * 0.20 as "revenueChangeAmount",
  0.50 as "engagementChangePercentage",
  0.10 as "publicationChangePercentage",
  0.20 as "followerChangePercentage",
  0.10 as "collectChangePercentage",
  0.20 as "revenueChangePercentage"
from post_summary
inner join comment_summary on true
inner join mirror_summary on true
inner join follower_summary on true
inner join collect_summary on true
inner join revenue_summary on true;
`;

export default summary30DaysSql;