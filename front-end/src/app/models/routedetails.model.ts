import { Point } from './point.model';

export interface IRouteDetails {
    id: number;
    start: string;
    end: string;
    distance: number;
    points: Point[];
    noneNormalSegments: string[];
    duration: number;
    distanceDescription: string;
    durationDescription: string;
}

export class RouteDetails implements IRouteDetails {
    id: number;
    start: string;
    end: string;
    distance: number;
    points: Point[] = [];
    noneNormalSegments: string[] = [];
    duration: number;
    distanceDescription: string;
    durationDescription: string;

    constructor() { }
}
