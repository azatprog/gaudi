export interface IVehicle {
    id: Number;
    type: String;
    model: String;
    sn: String;
    state: String;
    missionId: Number;
}

export class Vehicle implements IVehicle {
    id: Number;
    type: String;
    model: String;
    sn: String;
    state: String;
    missionId: Number;

    constructor() { }
}