--
-- PostgreSQL database dump
--

-- Dumped from database version 14.6 (Debian 14.6-1.pgdg110+1)
-- Dumped by pg_dump version 14.6 (Debian 14.6-1.pgdg110+1)


--
-- Name: lenshub_event_approval; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_approval (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    owner text,
    approved text,
    "tokenId" bigint
);


ALTER TABLE public.lenshub_event_approval OWNER TO postgres;

--
-- Name: lenshub_event_approval_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_approval_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_approval_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_approval_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_approval_id_seq OWNED BY public.lenshub_event_approval.id;


--
-- Name: lenshub_event_approvalforall; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_approvalforall (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    owner text,
    operator text,
    approved boolean
);


ALTER TABLE public.lenshub_event_approvalforall OWNER TO postgres;

--
-- Name: lenshub_event_approvalforall_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_approvalforall_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_approvalforall_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_approvalforall_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_approvalforall_id_seq OWNED BY public.lenshub_event_approvalforall.id;


--
-- Name: lenshub_event_collected; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_collected (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    collector text,
    "profileId" bigint,
    "pubId" bigint,
    "rootProfileId" bigint,
    "rootPubId" bigint,
    "collectModuleData" text,
    "timestamp" bigint
);


ALTER TABLE public.lenshub_event_collected OWNER TO postgres;

--
-- Name: lenshub_event_collected_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_collected_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_collected_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_collected_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_collected_id_seq OWNED BY public.lenshub_event_collected.id;


--
-- Name: lenshub_event_collectnftdeployed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_collectnftdeployed (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    "profileId" bigint,
    "pubId" bigint,
    "collectNFT" text,
    "timestamp" bigint
);


ALTER TABLE public.lenshub_event_collectnftdeployed OWNER TO postgres;

--
-- Name: lenshub_event_collectnftdeployed_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_collectnftdeployed_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_collectnftdeployed_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_collectnftdeployed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_collectnftdeployed_id_seq OWNED BY public.lenshub_event_collectnftdeployed.id;


--
-- Name: lenshub_event_collectnfttransferred; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_collectnfttransferred (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    "profileId" bigint,
    "pubId" bigint,
    "collectNFTId" bigint,
    "from" text,
    "to" text,
    "timestamp" bigint
);


ALTER TABLE public.lenshub_event_collectnfttransferred OWNER TO postgres;

--
-- Name: lenshub_event_collectnfttransferred_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_collectnfttransferred_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_collectnfttransferred_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_collectnfttransferred_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_collectnfttransferred_id_seq OWNED BY public.lenshub_event_collectnfttransferred.id;


--
-- Name: lenshub_event_commentcreated; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_commentcreated (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    "profileId" bigint,
    "pubId" bigint,
    "contentURI" text,
    "profileIdPointed" bigint,
    "pubIdPointed" bigint,
    "referenceModuleData" text,
    "collectModule" text,
    "collectModuleReturnData" text,
    "referenceModule" text,
    "referenceModuleReturnData" text,
    "timestamp" bigint
);


ALTER TABLE public.lenshub_event_commentcreated OWNER TO postgres;

--
-- Name: lenshub_event_commentcreated_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_commentcreated_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_commentcreated_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_commentcreated_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_commentcreated_id_seq OWNED BY public.lenshub_event_commentcreated.id;


--
-- Name: lenshub_event_defaultprofileset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_defaultprofileset (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    wallet text,
    "profileId" bigint,
    "timestamp" bigint
);


ALTER TABLE public.lenshub_event_defaultprofileset OWNER TO postgres;

--
-- Name: lenshub_event_defaultprofileset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_defaultprofileset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_defaultprofileset_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_defaultprofileset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_defaultprofileset_id_seq OWNED BY public.lenshub_event_defaultprofileset.id;


--
-- Name: lenshub_event_dispatcherset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_dispatcherset (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    "profileId" bigint,
    dispatcher text,
    "timestamp" bigint
);


ALTER TABLE public.lenshub_event_dispatcherset OWNER TO postgres;

--
-- Name: lenshub_event_dispatcherset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_dispatcherset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_dispatcherset_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_dispatcherset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_dispatcherset_id_seq OWNED BY public.lenshub_event_dispatcherset.id;


--
-- Name: lenshub_event_followed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_followed (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    follower text,
    "profileIds" bigint[],
    "followModuleDatas" text[],
    "timestamp" bigint
);


ALTER TABLE public.lenshub_event_followed OWNER TO postgres;

--
-- Name: lenshub_event_followed_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_followed_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_followed_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_followed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_followed_id_seq OWNED BY public.lenshub_event_followed.id;


--
-- Name: lenshub_event_followmoduleset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_followmoduleset (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    "profileId" bigint,
    "followModule" text,
    "followModuleReturnData" text,
    "timestamp" bigint
);


ALTER TABLE public.lenshub_event_followmoduleset OWNER TO postgres;

--
-- Name: lenshub_event_followmoduleset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_followmoduleset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_followmoduleset_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_followmoduleset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_followmoduleset_id_seq OWNED BY public.lenshub_event_followmoduleset.id;


--
-- Name: lenshub_event_follownftdeployed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_follownftdeployed (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    "profileId" bigint,
    "followNFT" text,
    "timestamp" bigint
);


ALTER TABLE public.lenshub_event_follownftdeployed OWNER TO postgres;

--
-- Name: lenshub_event_follownftdeployed_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_follownftdeployed_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_follownftdeployed_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_follownftdeployed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_follownftdeployed_id_seq OWNED BY public.lenshub_event_follownftdeployed.id;


--
-- Name: lenshub_event_follownfttransferred; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_follownfttransferred (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    "profileId" bigint,
    "followNFTId" bigint,
    "from" text,
    "to" text,
    "timestamp" bigint
);


ALTER TABLE public.lenshub_event_follownfttransferred OWNER TO postgres;

--
-- Name: lenshub_event_follownfttransferred_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_follownfttransferred_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_follownfttransferred_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_follownfttransferred_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_follownfttransferred_id_seq OWNED BY public.lenshub_event_follownfttransferred.id;


--
-- Name: lenshub_event_mirrorcreated; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_mirrorcreated (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    "profileId" bigint,
    "pubId" bigint,
    "profileIdPointed" bigint,
    "pubIdPointed" bigint,
    "referenceModuleData" text,
    "referenceModule" text,
    "referenceModuleReturnData" text,
    "timestamp" bigint
);


ALTER TABLE public.lenshub_event_mirrorcreated OWNER TO postgres;

--
-- Name: lenshub_event_mirrorcreated_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_mirrorcreated_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_mirrorcreated_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_mirrorcreated_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_mirrorcreated_id_seq OWNED BY public.lenshub_event_mirrorcreated.id;


--
-- Name: lenshub_event_postcreated; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_postcreated (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    "profileId" bigint,
    "pubId" bigint,
    "contentURI" text,
    "collectModule" text,
    "collectModuleReturnData" text,
    "referenceModule" text,
    "referenceModuleReturnData" text,
    "timestamp" bigint
);


ALTER TABLE public.lenshub_event_postcreated OWNER TO postgres;

--
-- Name: lenshub_event_postcreated_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_postcreated_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_postcreated_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_postcreated_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_postcreated_id_seq OWNED BY public.lenshub_event_postcreated.id;


--
-- Name: lenshub_event_profilecreated; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_profilecreated (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    "profileId" bigint,
    creator text,
    "to" text,
    handle text,
    "imageURI" text,
    "followModule" text,
    "followModuleReturnData" text,
    "followNFTURI" text,
    "timestamp" bigint
);


ALTER TABLE public.lenshub_event_profilecreated OWNER TO postgres;

--
-- Name: lenshub_event_profilecreated_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_profilecreated_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_profilecreated_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_profilecreated_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_profilecreated_id_seq OWNED BY public.lenshub_event_profilecreated.id;


--
-- Name: lenshub_event_profileimageuriset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_profileimageuriset (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    "profileId" bigint,
    "imageURI" text,
    "timestamp" bigint
);


ALTER TABLE public.lenshub_event_profileimageuriset OWNER TO postgres;

--
-- Name: lenshub_event_profileimageuriset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_profileimageuriset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_profileimageuriset_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_profileimageuriset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_profileimageuriset_id_seq OWNED BY public.lenshub_event_profileimageuriset.id;


--
-- Name: lenshub_event_transfer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.lenshub_event_transfer (
    id bigint NOT NULL,
    evt_block_hash text,
    evt_block_number text,
    evt_block_time text,
    evt_tx_hash text,
    evt_index text,
    contract_address text,
    "from" text,
    "to" text,
    "tokenId" bigint
);


ALTER TABLE public.lenshub_event_transfer OWNER TO postgres;

--
-- Name: lenshub_event_transfer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lenshub_event_transfer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lenshub_event_transfer_id_seq OWNER TO postgres;

--
-- Name: lenshub_event_transfer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lenshub_event_transfer_id_seq OWNED BY public.lenshub_event_transfer.id;


--
-- Name: lenshub_event_approval id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_approval ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_approval_id_seq'::regclass);


--
-- Name: lenshub_event_approvalforall id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_approvalforall ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_approvalforall_id_seq'::regclass);


--
-- Name: lenshub_event_collected id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_collected ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_collected_id_seq'::regclass);


--
-- Name: lenshub_event_collectnftdeployed id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_collectnftdeployed ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_collectnftdeployed_id_seq'::regclass);


--
-- Name: lenshub_event_collectnfttransferred id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_collectnfttransferred ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_collectnfttransferred_id_seq'::regclass);


--
-- Name: lenshub_event_commentcreated id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_commentcreated ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_commentcreated_id_seq'::regclass);


--
-- Name: lenshub_event_defaultprofileset id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_defaultprofileset ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_defaultprofileset_id_seq'::regclass);


--
-- Name: lenshub_event_dispatcherset id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_dispatcherset ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_dispatcherset_id_seq'::regclass);


--
-- Name: lenshub_event_followed id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_followed ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_followed_id_seq'::regclass);


--
-- Name: lenshub_event_followmoduleset id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_followmoduleset ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_followmoduleset_id_seq'::regclass);


--
-- Name: lenshub_event_follownftdeployed id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_follownftdeployed ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_follownftdeployed_id_seq'::regclass);


--
-- Name: lenshub_event_follownfttransferred id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_follownfttransferred ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_follownfttransferred_id_seq'::regclass);


--
-- Name: lenshub_event_mirrorcreated id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_mirrorcreated ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_mirrorcreated_id_seq'::regclass);


--
-- Name: lenshub_event_postcreated id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_postcreated ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_postcreated_id_seq'::regclass);


--
-- Name: lenshub_event_profilecreated id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_profilecreated ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_profilecreated_id_seq'::regclass);


--
-- Name: lenshub_event_profileimageuriset id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_profileimageuriset ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_profileimageuriset_id_seq'::regclass);


--
-- Name: lenshub_event_transfer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_transfer ALTER COLUMN id SET DEFAULT nextval('public.lenshub_event_transfer_id_seq'::regclass);


--
-- Name: lenshub_event_approval lenshub_event_approval_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_approval
    ADD CONSTRAINT lenshub_event_approval_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_approval lenshub_event_approval_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_approval
    ADD CONSTRAINT lenshub_event_approval_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_approvalforall lenshub_event_approvalforall_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_approvalforall
    ADD CONSTRAINT lenshub_event_approvalforall_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_approvalforall lenshub_event_approvalforall_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_approvalforall
    ADD CONSTRAINT lenshub_event_approvalforall_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_collected lenshub_event_collected_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_collected
    ADD CONSTRAINT lenshub_event_collected_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_collected lenshub_event_collected_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_collected
    ADD CONSTRAINT lenshub_event_collected_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_collectnftdeployed lenshub_event_collectnftdeployed_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_collectnftdeployed
    ADD CONSTRAINT lenshub_event_collectnftdeployed_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_collectnftdeployed lenshub_event_collectnftdeployed_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_collectnftdeployed
    ADD CONSTRAINT lenshub_event_collectnftdeployed_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_collectnfttransferred lenshub_event_collectnfttransferred_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_collectnfttransferred
    ADD CONSTRAINT lenshub_event_collectnfttransferred_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_collectnfttransferred lenshub_event_collectnfttransferred_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_collectnfttransferred
    ADD CONSTRAINT lenshub_event_collectnfttransferred_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_commentcreated lenshub_event_commentcreated_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_commentcreated
    ADD CONSTRAINT lenshub_event_commentcreated_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_commentcreated lenshub_event_commentcreated_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_commentcreated
    ADD CONSTRAINT lenshub_event_commentcreated_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_defaultprofileset lenshub_event_defaultprofileset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_defaultprofileset
    ADD CONSTRAINT lenshub_event_defaultprofileset_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_defaultprofileset lenshub_event_defaultprofileset_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_defaultprofileset
    ADD CONSTRAINT lenshub_event_defaultprofileset_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_dispatcherset lenshub_event_dispatcherset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_dispatcherset
    ADD CONSTRAINT lenshub_event_dispatcherset_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_dispatcherset lenshub_event_dispatcherset_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_dispatcherset
    ADD CONSTRAINT lenshub_event_dispatcherset_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_followed lenshub_event_followed_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_followed
    ADD CONSTRAINT lenshub_event_followed_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_followed lenshub_event_followed_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_followed
    ADD CONSTRAINT lenshub_event_followed_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_followmoduleset lenshub_event_followmoduleset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_followmoduleset
    ADD CONSTRAINT lenshub_event_followmoduleset_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_followmoduleset lenshub_event_followmoduleset_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_followmoduleset
    ADD CONSTRAINT lenshub_event_followmoduleset_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_follownftdeployed lenshub_event_follownftdeployed_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_follownftdeployed
    ADD CONSTRAINT lenshub_event_follownftdeployed_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_follownftdeployed lenshub_event_follownftdeployed_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_follownftdeployed
    ADD CONSTRAINT lenshub_event_follownftdeployed_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_follownfttransferred lenshub_event_follownfttransferred_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_follownfttransferred
    ADD CONSTRAINT lenshub_event_follownfttransferred_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_follownfttransferred lenshub_event_follownfttransferred_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_follownfttransferred
    ADD CONSTRAINT lenshub_event_follownfttransferred_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_mirrorcreated lenshub_event_mirrorcreated_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_mirrorcreated
    ADD CONSTRAINT lenshub_event_mirrorcreated_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_mirrorcreated lenshub_event_mirrorcreated_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_mirrorcreated
    ADD CONSTRAINT lenshub_event_mirrorcreated_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_postcreated lenshub_event_postcreated_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_postcreated
    ADD CONSTRAINT lenshub_event_postcreated_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_postcreated lenshub_event_postcreated_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_postcreated
    ADD CONSTRAINT lenshub_event_postcreated_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_profilecreated lenshub_event_profilecreated_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_profilecreated
    ADD CONSTRAINT lenshub_event_profilecreated_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_profilecreated lenshub_event_profilecreated_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_profilecreated
    ADD CONSTRAINT lenshub_event_profilecreated_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_profileimageuriset lenshub_event_profileimageuriset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_profileimageuriset
    ADD CONSTRAINT lenshub_event_profileimageuriset_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_profileimageuriset lenshub_event_profileimageuriset_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_profileimageuriset
    ADD CONSTRAINT lenshub_event_profileimageuriset_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- Name: lenshub_event_transfer lenshub_event_transfer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_transfer
    ADD CONSTRAINT lenshub_event_transfer_pkey PRIMARY KEY (id);


--
-- Name: lenshub_event_transfer lenshub_event_transfer_txhash_evt_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenshub_event_transfer
    ADD CONSTRAINT lenshub_event_transfer_txhash_evt_index UNIQUE (evt_tx_hash, evt_index);


--
-- PostgreSQL database dump complete
--

