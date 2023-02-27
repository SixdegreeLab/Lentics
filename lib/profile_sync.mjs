import { Command } from 'commander';
import pg from 'pg';
const program = new Command();
const { Pool, types } = pg;

function parseArgs(){
  console.log('process.argv', process.argv)
  program
    .option('-h, --host <char>', 'db host', 'db')
    .option('-p, --port <number>', 'db port', 5432)
    .option('-u, --user <char>', 'db user', 'postgres')
    .option('-w, --password <char>', 'db password', 'postgres')
    .option('-d, --dbname <char>', 'db name', 'lenticsdb')
    .parse(process.argv);
  return program.opts()
}

async function main() {
  let {
    host,
    port,
    user,
    password,
    dbname
  } =  parseArgs();
  
  const dbPool = new Pool({
    host: host,
    port: port,
    user: user,
    password: password,
    database: dbname
  });
  let client = await dbPool.connect();
  
  console.log(`Profile owner processing: ${(new Date()).toLocaleString()}`)

  const updateSql = `WITH profile_with_real_owner as (
select distinct pf."profileId",
  pf."to",
  pf.handle,
  (CASE WHEN coalesce(d.current_profile_id, 0) > 0 THEN true ELSE false END) as is_default 
from (
  select distinct p.id,
    p.evt_block_hash,
    p.evt_block_number,
    p.evt_block_time,
    p.evt_tx_hash,
    p.evt_index,
    p.contract_address,
    p."profileId",
    p.creator,
    first_value(t."to") over (partition by t."tokenId" order by t.evt_block_time desc) as "to", -- last transfer to is owner
    p.handle,
    p."imageURI",
    p."followModule",
    p."followModuleReturnData",
    p."followNFTURI",
    p.timestamp
  from lenshub_event_profilecreated p
  inner join lenshub_event_transfer t on p."profileId" = t."tokenId"
) pf
left join (
  select wallet, current_profile_id, handle as current_handle
  from (
    select distinct wallet, 
      first_value("profileId") over (partition by wallet order by evt_block_time desc) as current_profile_id
    from lenshub_event_defaultprofileset
  ) w
  inner join lenshub_event_profilecreated p on w.current_profile_id = p."profileId"
) d on pf."to" = d.wallet and pf."profileId" = d.current_profile_id
)
UPDATE lenshub_event_profilecreated
SET current_owner = profile_with_real_owner."to",
  is_default = profile_with_real_owner.is_default
FROM profile_with_real_owner
WHERE lenshub_event_profilecreated."profileId" = profile_with_real_owner."profileId";
`
  await client.query(updateSql);

  console.log(`Profile follower counting: ${(new Date()).toLocaleString()}`)
  const countFollower = `WITH profile_follower as (
    SELECT p."profileId", COUNT(*) AS follower_count
FROM lenshub_event_profilecreated p
INNER JOIN lateral (
  SELECT DISTINCT "followNFTId"
  FROM lenshub_event_follownfttransferred
  WHERE "profileId" = p."profileId"
) f on true
WHERE p.current_owner <> '0x0000000000000000000000000000000000000000'
GROUP by 1
)
UPDATE lenshub_event_profilecreated
SET follower = profile_follower.follower_count
FROM profile_follower
WHERE lenshub_event_profilecreated."profileId" = profile_follower."profileId"`;
  await client.query(countFollower);

  // TODO: Commented, fetch following and follower from lens api, just get top follower by follower count in db. 
  /*console.log(`Profile following counting: ${(new Date()).toLocaleString()}`);
  const countFollowing = `WITH profile_following as (
  SELECT p."profileId", count_following_of_follower(p.current_owner) AS following_count
FROM lenshub_event_profilecreated p
WHERE p.current_owner <> '0x0000000000000000000000000000000000000000'
)
UPDATE lenshub_event_profilecreated
SET following = profile_following.following_count
FROM profile_following
WHERE lenshub_event_profilecreated."profileId" = profile_following."profileId"`;
  await client.query(countFollowing);
  console.log(`Profile sync end: ${(new Date()).toLocaleString()}`)*/
  
  dbPool.end();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });