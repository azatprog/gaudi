export class Point {
    public lng: number;
    public lat: number;
    public elevation: number;
    public speedLimit: number;
    constructor(lng: number, lat: number) {
      this.lng = lng;
      this.lat = lat;
    }
}
