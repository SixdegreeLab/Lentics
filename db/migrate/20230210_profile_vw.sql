-- profilecreated_vw
DROP VIEW IF EXISTS "public"."profilecreated_vw";
CREATE VIEW "public"."profilecreated_vw" AS
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
  inner join lenshub_event_transfer t on p."profileId" = t."tokenId";

ALTER TABLE "public"."profilecreated_vw" OWNER TO "postgres";
