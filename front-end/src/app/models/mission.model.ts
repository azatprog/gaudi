import { Vehicle } from './vehicle.model';
import { RouteDetails } from './routedetails.model';

export interface IMission {
    id: number;
    name: string;
    startDate: string;
    vehicles: Vehicle[];
    route: RouteDetails;
}

export class Mission implements IMission {
    id: number;
    name: string;
    startDate: string;
    vehicles: Vehicle[] = [];
    route: RouteDetails;

    constructor() {
        this.route = new RouteDetails();
    }
}
