import { Injectable } from '@angular/core';

export class RouteDetails {
  public route: number[][];
  public distance: Number;
  public start: String;
  public end: String;
  public duration: Number;
  public distanceDescription: String;
  public durationDescription: String;

  constructor() {

  }
}

@Injectable()
export class MapService {
  private geocoder: google.maps.Geocoder;
  pointA: String;
  pointB: String;

  constructor() { }

  getRoute(start, end): Promise<RouteDetails>  {
    return new Promise<RouteDetails>( (resolve, reject) => {
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
            var routeDetails: RouteDetails  = new RouteDetails();
            routeDetails.distance = route.legs[0].distance.value;
            routeDetails.distanceDescription = route.legs[0].distance.text;
            routeDetails.duration = route.legs[0].duration.value;
            routeDetails.durationDescription = route.legs[0].duration.text;
            routeDetails.start = route.legs[0].start_address;
            routeDetails.end = route.legs[0].end_address;
            routeDetails.route = route.overview_path.map(p => { return [p.lng(), p.lat()] });
            resolve(routeDetails);
          } else {
            reject("Error: route didn't find");
          }
        } else {
          reject("Error: bad answer " + status);
        }
      });
    });
  }

  getCoordinates(point): Promise<[number][number]> {
    if (this.geocoder == null) {
      this.geocoder = new google.maps.Geocoder();
    }
    
    return new Promise<[number][number]>((resolve, reject) => {
    this.geocoder.geocode( {'address': point},
          (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
            if(status == google.maps.GeocoderStatus.OK) {
              if (results.length > 0) {               
                var xCenter = results[0].geometry.bounds.getCenter().lng();
                var yCenter = results[0].geometry.bounds.getCenter().lat();
                resolve([xCenter][yCenter]);
              } else {            
              reject("Error: point didn't find");
              }
            } else {
              reject("Error: bad answer " + status);
            }
      });
    });
  }
}
