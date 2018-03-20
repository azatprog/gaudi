export interface IMission {
    id: Number;
    name: String;
    startDate: String;
    routeStart: String;
    routeFinish: String;
}

export class Mission implements IMission {
    id: Number;
    name: String;
    startDate: String;
    routeStart: String;
    routeFinish: String;

    constructor() { }
}