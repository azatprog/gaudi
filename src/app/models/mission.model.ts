export interface IMission {
    id: Number;
    name: String;
    startDate: String;
    missionStart: String;
    missionFinish: String;
}

export class Mission implements IMission {
    id: Number;
    name: String;
    startDate: String;
    missionStart: String;
    missionFinish: String;

    constructor() { }
}