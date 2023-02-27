-- lenshub_event_profilecreated
ALTER TABLE lenshub_event_profilecreated ADD COLUMN IF NOT EXISTS current_owner text;
ALTER TABLE lenshub_event_profilecreated ADD COLUMN IF NOT EXISTS is_default boolean;
CREATE INDEX IF NOT EXISTS lenshub_event_profilecreated_current_owner ON lenshub_event_profilecreated ("current_owner");

ALTER TABLE lenshub_event_profilecreated ADD COLUMN IF NOT EXISTS follower bigint DEFAULT 0;
ALTER TABLE lenshub_event_profilecreated ADD COLUMN IF NOT EXISTS following bigint DEFAULT 0;


