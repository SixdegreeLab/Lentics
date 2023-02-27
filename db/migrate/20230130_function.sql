-- PL/py extension
CREATE EXTENSION IF NOT EXISTS plpython3u;

-- UDF
CREATE OR REPLACE FUNCTION hex2numeric(a text)
   RETURNS NUMERIC
AS $$
 return int(a, 16)
$$ LANGUAGE plpython3u IMMUTABLE STRICT;

-- get current nft record
CREATE OR REPLACE FUNCTION follow_transferred_current(profile_id bigint, follow_nft_id bigint)
   RETURNS lenshub_event_follownfttransferred
AS $$
 select * from lenshub_event_follownfttransferred where "profileId" = profile_id and "followNFTId" = follow_nft_id order by evt_block_time desc limit 1;
$$ LANGUAGE sql IMMUTABLE STRICT;

-- Iterate to count following for follower
CREATE OR REPLACE FUNCTION count_following_of_follower(follower text)
   RETURNS NUMERIC
AS $$
  cnt = 0
  plan = plpy.prepare('select f."profileId", f."followNFTId", f.evt_block_time, f."to" as follower from lenshub_event_follownfttransferred f where f."to" = $1', ["text"])
  transferred = plpy.cursor(plan, [follower])
  for row in transferred:
    if row:
      plan = plpy.prepare('select "profileId", "followNFTId", evt_block_time, "to" from lenshub_event_follownfttransferred where "profileId" = $1 and "followNFTId" = $2 order by evt_block_time desc', ["integer", "integer"])
      r = plan.execute([row['profileId'], row['followNFTId']], 1)
      if r and r[0]['to'] != '0x0000000000000000000000000000000000000000' and r[0]['profileId'] == row['profileId'] and r[0]['followNFTId'] == row['followNFTId'] and r[0]['evt_block_time'] == row['evt_block_time']:
        cnt += 1
  return cnt
$$ LANGUAGE plpython3u IMMUTABLE STRICT;
