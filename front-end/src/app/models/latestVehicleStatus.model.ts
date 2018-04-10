export class LatestVehicleStatus {
    vehicleId: number;
    missionId: number;
    lng: number;
    lat: number;
    speed: number;
    missionMileage: number;
    timeFromMissionStart: number;
    rpm: number;
    engineTemperature: number;
    outsideTemperature: number;
    oilPressure: number;
    coolingFluidLevel: true;
    throttle: number;
    gear: string;
    pushBrakePedal: number;
    brakeTemperature: number;
    mass: number;
    cumulBrakePedalPushingWeight: number;
    cumulBrakeHighTempOperation: number;
    cumulDescentMileage: number;
    cumulEngineOperation: number;
    cumulEngineHighLoadOperation: number;
    cumulEngineHighTempOperation: number;
    cumulGearOperation: number;
    cumulGearHighLoadOperation: number;
    engineFault: true;
    gearFault: true;
    brakeFault: true;

    constructor() {}
}
