-- profilecreated_vw
CREATE OR REPLACE VIEW profilecreated_vw as
select distinct pf.id,
	pf.evt_block_hash,
	pf.evt_block_number,
	pf.evt_block_time,
	pf.evt_tx_hash,
	pf.evt_index,
	pf.contract_address,
	coalesce(d.current_profile_id, pf."profileId") as "profileId",
	pf.creator,
	pf."to",
	coalesce(d.current_handle, pf.handle) as handle,
	pf."imageURI",
	pf."followModule",
	pf."followModuleReturnData",
	pf."followNFTURI",
	pf.timestamp
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
left join 
(
	select wallet, current_profile_id, handle as current_handle
	from (
		select distinct wallet, 
		first_value("profileId") over (partition by wallet order by evt_block_time desc) as current_profile_id
		from lenshub_event_defaultprofileset
	) w
	inner join lenshub_event_profilecreated p on w.current_profile_id = p."profileId"
) d on pf."to" = d.wallet;
