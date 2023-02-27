-- Table structure for lenshub_publication
-- DROP TABLE public.lenshub_publication;
CREATE TABLE IF NOT EXISTS public.lenshub_publication (
  id varchar NOT NULL,
  "profileId" int8 NOT NULL,
  "pubId" int8 NOT NULL,
  "appId" varchar,
  "createdAt" timestamp,
  "typeName" varchar,
  metadata json NULL DEFAULT '{}'::json,
  CONSTRAINT lenshub_publication_pk PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS lenshub_publication_profileid_idx ON public.lenshub_publication ("profileId","pubId");

ALTER TABLE public.lenshub_publication ADD COLUMN IF NOT EXISTS updated boolean NOT NULL DEFAULT false;
ALTER TABLE public.lenshub_publication ADD COLUMN IF NOT EXISTS "updateAt" timestamp NOT NULL DEFAULT now();

DROP INDEX IF EXISTS public.lenshub_publication_profileid_idx_typename;
CREATE INDEX IF NOT EXISTS lenshub_publication_profileid_idx_updated ON public.lenshub_publication (updated);
