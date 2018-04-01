export interface IVehicle {
    id: number;
    vtype: string;
    model: string;
    sn: string;
    state: number;
}

export class Vehicle implements IVehicle {
    id: number;
    vtype: string;
    model: string;
    sn: string;
    state: number;

    constructor() { }
}
