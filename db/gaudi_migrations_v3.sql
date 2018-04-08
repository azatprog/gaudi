-- Table: public."VehiclePrognosis"

-- DROP TABLE public."VehiclePrognosis";

CREATE TABLE public."VehiclePrognosis"
(
    "successChance" integer NOT NULL,
    lng numeric(20,16) NOT NULL,
    "missionId" bigint NOT NULL,
    "vehicleId" bigint NOT NULL,
    id bigint NOT NULL,
    lat numeric(20,16) NOT NULL,
    CONSTRAINT "VehiclePrognosis_pkey" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."VehiclePrognosis"
    OWNER to gaudi;

-- Index: idx8b410a3f

-- DROP INDEX public.idx8b410a3f;

CREATE INDEX idx8b410a3f
    ON public."VehiclePrognosis" USING btree
    ("vehicleId")
    TABLESPACE pg_default;

-- Index: idx8bde0a61

-- DROP INDEX public.idx8bde0a61;

CREATE INDEX idx8bde0a61
    ON public."VehiclePrognosis" USING btree
    ("missionId")
    TABLESPACE pg_default;
	
-- CREATE SEQUENCE

CREATE SEQUENCE public."s_VehiclePrognosis_id"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."s_VehiclePrognosis_id"
    OWNER TO gaudi;