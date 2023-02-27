-- follow_transferred_vw
CREATE OR REPLACE VIEW follow_transferred_vw as
select f.*,
  p.handle as "followerHandle",
  p."profileId" as "followerProfileId"
from lenshub_event_follownfttransferred f
inner join lateral (
  select 1
  from lenshub_event_follownfttransferred
  where "profileId" = f."profileId"
  and "followNFTId" = f."followNFTId"
  having max(evt_block_time) = f.evt_block_time
) as d on true
inner join lateral (
  select p.current_owner,
    p.handle,
    p."profileId"
  from lenshub_event_profilecreated p
  where p.current_owner <> '0x0000000000000000000000000000000000000000'
  and p.current_owner = f."to"
  order by p.is_default desc
  limit 1
) p on true
where f."to" <> '0x0000000000000000000000000000000000000000';
