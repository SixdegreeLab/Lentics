-- lenshub_event_profilecreated
CREATE INDEX IF NOT EXISTS lenshub_event_profilecreated_profileid ON lenshub_event_profilecreated ("profileId");
CREATE INDEX IF NOT EXISTS lenshub_event_profilecreated_handle ON lenshub_event_profilecreated ("handle");
CREATE INDEX IF NOT EXISTS lenshub_event_profilecreated_to ON lenshub_event_profilecreated ("to");
CREATE INDEX IF NOT EXISTS lenshub_event_profilecreated_evt_block_time ON lenshub_event_profilecreated ("evt_block_time");

-- lenshub_event_transfer
CREATE INDEX IF NOT EXISTS lenshub_event_transfer_tokenid ON lenshub_event_transfer ("tokenId");
CREATE INDEX IF NOT EXISTS lenshub_event_transfer_from ON lenshub_event_transfer ("from");
CREATE INDEX IF NOT EXISTS lenshub_event_transfer_to ON lenshub_event_transfer ("to");
CREATE INDEX IF NOT EXISTS lenshub_event_transfer_evt_block_time ON lenshub_event_transfer ("evt_block_time");

-- lenshub_event_postcreated
CREATE INDEX IF NOT EXISTS lenshub_event_postcreated_profileid ON lenshub_event_postcreated ("profileId");
CREATE INDEX IF NOT EXISTS lenshub_event_postcreated_profileid_pubid ON lenshub_event_postcreated ("profileId", "pubId");
CREATE INDEX IF NOT EXISTS lenshub_event_postcreated_evt_block_time ON lenshub_event_postcreated ("evt_block_time");

-- lenshub_event_commentcreated
CREATE INDEX IF NOT EXISTS lenshub_event_commentcreated_profileid ON lenshub_event_commentcreated ("profileId");
CREATE INDEX IF NOT EXISTS lenshub_event_commentcreated_profileid_pubid ON lenshub_event_commentcreated ("profileId", "pubId");
CREATE INDEX IF NOT EXISTS lenshub_event_commentcreated_profileidpointed ON lenshub_event_commentcreated ("profileIdPointed");
CREATE INDEX IF NOT EXISTS lenshub_event_commentcreated_profileidpointed_pubidpointed ON lenshub_event_commentcreated ("profileIdPointed", "pubIdPointed");
CREATE INDEX IF NOT EXISTS lenshub_event_commentcreated_evt_block_time ON lenshub_event_commentcreated ("evt_block_time");

-- lenshub_event_followed
CREATE INDEX IF NOT EXISTS lenshub_event_commentcreated_follower ON lenshub_event_followed ("follower");


-- lenshub_event_follownfttransferred
CREATE INDEX IF NOT EXISTS lenshub_event_follownfttransferred_profileid ON lenshub_event_follownfttransferred ("profileId");
CREATE INDEX IF NOT EXISTS lenshub_event_follownfttransferred_follownftid ON lenshub_event_follownfttransferred ("followNFTId");
CREATE INDEX IF NOT EXISTS lenshub_event_follownfttransferred_from ON lenshub_event_follownfttransferred ("from");
CREATE INDEX IF NOT EXISTS lenshub_event_follownfttransferred_to ON lenshub_event_follownfttransferred ("to");
CREATE INDEX IF NOT EXISTS lenshub_event_follownfttransferred_evt_block_time ON lenshub_event_follownfttransferred ("evt_block_time");


-- lenshub_event_collected
CREATE INDEX IF NOT EXISTS lenshub_event_collected_collector ON lenshub_event_collected ("collector");
CREATE INDEX IF NOT EXISTS lenshub_event_collected_profileid ON lenshub_event_collected ("profileId");
CREATE INDEX IF NOT EXISTS lenshub_event_collected_profileid_pubid ON lenshub_event_collected ("profileId", "pubId");
CREATE INDEX IF NOT EXISTS lenshub_event_collected_rootprofileid ON lenshub_event_collected ("rootProfileId");
CREATE INDEX IF NOT EXISTS lenshub_event_collected_rootprofileid_rootpubid ON lenshub_event_collected ("rootProfileId", "rootPubId");
CREATE INDEX IF NOT EXISTS lenshub_event_collected_evt_block_time ON lenshub_event_collected ("evt_block_time");

-- lenshub_event_collectnfttransferred
CREATE INDEX IF NOT EXISTS lenshub_event_collectnfttransferred_profileid ON lenshub_event_collectnfttransferred ("profileId");
CREATE INDEX IF NOT EXISTS lenshub_event_collectnfttransferred_profileid_pubid ON lenshub_event_collectnfttransferred ("profileId", "pubId");
CREATE INDEX IF NOT EXISTS lenshub_event_collectnfttransferred_collectnftid ON lenshub_event_collectnfttransferred ("collectNFTId");
CREATE INDEX IF NOT EXISTS lenshub_event_collectnfttransferred_from ON lenshub_event_collectnfttransferred ("from");
CREATE INDEX IF NOT EXISTS lenshub_event_collectnfttransferred_to ON lenshub_event_collectnfttransferred ("to");
CREATE INDEX IF NOT EXISTS lenshub_event_collectnfttransferred_evt_block_time ON lenshub_event_collectnfttransferred ("evt_block_time");

-- lenshub_event_mirrorcreated
CREATE INDEX IF NOT EXISTS lenshub_event_mirrorcreated_profileid ON lenshub_event_mirrorcreated ("profileId");
CREATE INDEX IF NOT EXISTS lenshub_event_mirrorcreated_profileid_pubid ON lenshub_event_mirrorcreated ("profileId", "pubId");
CREATE INDEX IF NOT EXISTS lenshub_event_mirrorcreated_profileidpointed ON lenshub_event_mirrorcreated ("profileIdPointed");
CREATE INDEX IF NOT EXISTS lenshub_event_mirrorcreated_profileidpointed_pubidpointed ON lenshub_event_mirrorcreated ("profileIdPointed", "pubIdPointed");
CREATE INDEX IF NOT EXISTS lenshub_event_mirrorcreated_evt_block_time ON lenshub_event_mirrorcreated ("evt_block_time");
