export interface IVehicle {
    id: Number;
    type: String;
    model: String;
    sn: String;
    state: String;
    mission: {
        id: Number;
        name: String;
    };
}

export class Vehicle implements IVehicle {
    id: Number;
    type: String;
    model: String;
    sn: String;
    state: String;
    mission: {
        id: Number;
        name: String;
    };

    constructor() { }
}