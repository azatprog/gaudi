import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { RouteDetails } from '../models/routedetails.model';
import { Point } from '../models/point.model';

// export class Point {
//   public lng: number;
//   public lan: number;
//   public elevation: number;
//   public speedLimit: number;

//   constructor(lng: number, lan: number) {
//     this.lng = lng;
//     this.lan = lan;
//   }
// }

// export class RouteDetails {
//   public route: Array<Point> = new Array<Point>();
//   public distance: Number;
//   public start: String;
//   public end: String;
//   public duration: Number;
//   public distanceDescription: String;
//   public durationDescription: String;

//   constructor() {
//   }
// }

@Injectable()
export class MapService {
  private geocoder: google.maps.Geocoder;
  start: String;
  end: String;

  constructor() { }

  getRoute(start, end): Promise<RouteDetails>  {
    return new Promise<RouteDetails>((resolve, reject) => {
      var directionsService = new google.maps.DirectionsService();
      let request: google.maps.DirectionsRequest = <google.maps.DirectionsRequest>{
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
      };
      directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {       
          if (result.routes.length > 0) {
            var route = result.routes[0];
            var routeDetails: RouteDetails  = MapService.convertPathToRoute(route);

            var elevator = new google.maps.ElevationService();
            let elevatorRequest: google.maps.PathElevationRequest = <google.maps.PathElevationRequest>{
              path: route.overview_path,
              samples: route.overview_path.length,
            }; 

            elevator.getElevationAlongPath(elevatorRequest, (result, status) => {
              if (status == google.maps.ElevationStatus.OK) {
                routeDetails.points.map((p, i) => {
                  p.elevation = result[i].elevation;
                  p.speedLimit = Math.floor(Math.random() * (120 - 40 + 1)) + 40;
                });
                resolve(routeDetails);
              } else {
                reject("Error: bad answer " + status);
              }
            });           
          } else {
            reject("Error: route didn't find");
          }
        } else {
          reject("Error: bad answer " + status);
        }
      });
    });
  }

  static convertPathToRoute(route: google.maps.DirectionsRoute): RouteDetails {
    var routeDetails: RouteDetails  = new RouteDetails();
    routeDetails.distance = route.legs[0].distance.value;
    routeDetails.distanceDescription = route.legs[0].distance.text;
    routeDetails.duration = route.legs[0].duration.value;
    routeDetails.durationDescription = route.legs[0].duration.text;
    routeDetails.start = route.legs[0].start_address;
    routeDetails.end = route.legs[0].end_address;
    routeDetails.points = route.overview_path.map(p => { return new Point(p.lng(), p.lat()) });
    return routeDetails;
  }
}
