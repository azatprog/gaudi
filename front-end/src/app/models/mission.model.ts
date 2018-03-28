export interface IMission {
    id: Number;
    name: String;
    startDate: String;
    routeStart: String;
    routeFinish: String;
    vehicles: Number[];
}

export class Mission implements IMission {
    id: Number;
    name: String;
    startDate: String;
    routeStart: String;
    routeFinish: String;
    vehicles: Number[];

    constructor() { }
}