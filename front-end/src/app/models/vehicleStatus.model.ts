export interface IVehicleStatus {
    vehicleId: number;
    missionId: number;
    lng: number;
    lat: number;
    mileage: number;
    speed: number;
    acceleration: number;
    missionMilage: number;
    timeFromMissionStart: number;
    rpm: number;
    engineTemperature: number;
    outsideTemperature: number;
    oilPressure: number;
    coolingFluidLevel: boolean;
    ignition: boolean;
    throttle: number;
    gear: string;
    pushBrakePedal: number;
    brakeFluidLevel: boolean;
    brakeTemperature: number;
    brakePadResidue: number;
    mass: string;
}

export class VehicleStatus implements IVehicleStatus {

    vehicleId: number = 0;
    missionId: number = 0;
    lng: number = 0;
    lat: number = 0;
    mileage: number = 0;
    speed: number = 0;
    acceleration: number = 0;
    missionMilage: number = 0;
    timeFromMissionStart: number = 0;
    rpm: number = 0;
    engineTemperature: number = 0;
    outsideTemperature: number = 0;
    oilPressure: number = 0;
    coolingFluidLevel: boolean = false;
    ignition: boolean = false;
    throttle: number = 0;
    gear: string = "";
    pushBrakePedal: number = 0;
    brakeFluidLevel: boolean = false;
    brakeTemperature: number = 0;
    brakePadResidue: number = 0;
    mass: string = "";
    missionMileage: number = 0;
    cumulBrakePedalPushingWeight: number = 0;
    cumulBrakeHighTempOperation: number = 0;
    cumulDescentMileage: number = 0;
    cumulEngineOperation: number = 0;
    cumulEngineHighLoadOperation: number = 0;
    cumulEngineHighTempOperation: number = 0;
    cumulGearOperation: number = 0;
    cumulGearHighLoadOperation: number = 0;
    engineFault: boolean = false;
    gearFault: boolean = false;
    brakeFault: boolean = false;

    constructor() {}
}
