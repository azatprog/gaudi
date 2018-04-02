export interface IMission {
    id: Number;
    name: String;
    startDate: String;
    routeStart: String;
    routeFinish: String;
    vehicles: Number[];
}

export class Mission implements IMission {
    id: number;
    name: String;
    startDate: String;
    routeStart: String;
    routeFinish: String;
    vehicles: number[];

    constructor() { }
}