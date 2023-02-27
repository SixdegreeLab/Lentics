-- ----------------------------
-- Table structure for coin
-- ----------------------------
CREATE TABLE IF NOT EXISTS public.coin (
    id character varying NOT NULL,
    symbol character varying NOT NULL,
    name character varying NOT NULL,
    blockchain character varying NOT NULL,
    contract_address text NOT NULL,
    decimals integer NOT NULL
);

-- ----------------------------
-- Primary Key structure for table coin
-- ----------------------------
DO $$ 
  BEGIN 
    IF NOT EXISTS (SELECT * FROM pg_constraint WHERE conname = 'coin_pkey') THEN 
      ALTER TABLE "public"."coin" OWNER TO "postgres";
      ALTER TABLE "public"."coin" ADD PRIMARY KEY ("id");
    END IF; 
  END
$$;

-- ----------------------------
-- seeds for table coin
-- ----------------------------
INSERT INTO coin
  ("id" , "symbol" , "name" , "blockchain" , "contract_address" , "decimals")
VALUES
  ('usd-coin','usdc','USD Coin','polygon-pos','0x2791bca1f2de4661ed88a30c99a7a9449aa84174',6),
  ('wmatic','wmatic','Wrapped Matic','polygon-pos','0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',18),
  ('dai','dai','Dai','polygon-pos','0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',18),
  ('weth','weth','WETH','polygon-pos','0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',18),
  ('toucan-protocol-nature-carbon-tonne','nct','Toucan Protocol: Nature Carbon Tonne','polygon-pos','0xd838290e877e0188a4a44700463419ed96c16107',18)
ON conflict do nothing;

-- ----------------------------
-- Table structure for price_usd
-- ----------------------------
CREATE TABLE IF NOT EXISTS public.price_usd (
    id bigint NOT NULL,
    coin_id character varying NOT NULL,
    price float8 NOT NULL,
    minute date NOT NULL
);

CREATE INDEX IF NOT EXISTS price_usd_coin_id ON price_usd ("coin_id");
CREATE INDEX IF NOT EXISTS price_usd_minute ON price_usd ("minute");

DO $$ 
  BEGIN 
    IF NOT EXISTS (SELECT * FROM pg_constraint WHERE conname = 'price_usd_uniqe') THEN 
      ALTER TABLE public.price_usd OWNER TO postgres;
      ALTER TABLE "public"."price_usd" ADD CONSTRAINT "price_usd_uniqe" UNIQUE ("coin_id", "minute");
    END IF; 
  END
$$;

-- ----------------------------
-- Name: price_usd_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
-- ----------------------------
CREATE SEQUENCE IF NOT EXISTS public.price_usd_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE public.price_usd_id_seq OWNER TO postgres;

-- ----------------------------
-- View structure for price_usd + coin
-- ----------------------------
CREATE OR REPLACE VIEW price_usd_vw as
  select p.coin_id, p.minute, c.blockchain, c.contract_address, c.decimals, c.symbol, p.price
  from coin c
  join price_usd p on p.coin_id = c.id;


-- ----------------------------
-- View for latest price_usd + coin
-- ----------------------------
CREATE OR REPLACE FUNCTION latest_price_usd(contract text)
   RETURNS price_usd_vw
AS $$
 select * from price_usd_vw where contract_address = contract order by minute desc limit 1;
$$ LANGUAGE sql IMMUTABLE STRICT;

CREATE OR REPLACE VIEW latest_price_usd_vw as
  select p.minute, c.blockchain, c.contract_address, c.decimals, c.symbol, p.price
  from coin c
  inner join lateral (
    select * from latest_price_usd(c.contract_address)
  ) p on true;
