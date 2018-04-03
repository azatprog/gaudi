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
    constructor() {}
}
