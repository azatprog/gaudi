ALTER TABLE public."VehicleStatus"
    ADD COLUMN "engineTemperature" double precision DEFAULT 0;
ALTER TABLE public."VehicleStatus"
	ADD COLUMN "outsideTemperature" double precision DEFAULT 0;
ALTER TABLE public."VehicleStatus"
	ADD COLUMN "oilPressure" double precision DEFAULT 0;
ALTER TABLE public."VehicleStatus"
	ADD COLUMN "coolingFluidLevel" boolean DEFAULT true;
ALTER TABLE public."VehicleStatus"
    ADD COLUMN "brakeTemperature" numeric(20, 16) DEFAULT 0;
ALTER TABLE public."VehicleStatus"
    ADD COLUMN "mass" integer DEFAULT 0;
ALTER TABLE public."VehicleStatus"
    ADD COLUMN "cumulBrakePedalPushingWeight" integer DEFAULT 0;
ALTER TABLE public."VehicleStatus"
    ADD COLUMN "cumulBrakeHighTempOperation" integer DEFAULT 0;
ALTER TABLE public."VehicleStatus"
    ADD COLUMN "cumulDescentMileage" double precision DEFAULT 0;
ALTER TABLE public."VehicleStatus"
    ADD COLUMN "cumulEngineOperation" integer DEFAULT 0;
ALTER TABLE public."VehicleStatus"
    ADD COLUMN "cumulEngineHighLoadOperation" integer DEFAULT 0;
ALTER TABLE public."VehicleStatus"
    ADD COLUMN "cumulEngineHighTempOperation" integer DEFAULT 0;
ALTER TABLE public."VehicleStatus"
    ADD COLUMN "cumulGearOperation" integer DEFAULT 0;
ALTER TABLE public."VehicleStatus"
    ADD COLUMN "cumulGearHighLoadOperation" integer DEFAULT 0;
ALTER TABLE public."VehicleStatus"
    ADD COLUMN "engineFault" boolean DEFAULT false;
ALTER TABLE public."VehicleStatus"
    ADD COLUMN "gearFault" boolean DEFAULT false;
ALTER TABLE public."VehicleStatus"
    ADD COLUMN "brakeFault" boolean DEFAULT false;
ALTER TABLE public."VehicleStatus"
    RENAME "missionMilage" TO "missionMileage";