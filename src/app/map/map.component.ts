import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  public zoom = 15;
  public opacity = 1.0;
  public width = 5;

  // Innopolis coordinates
  public xCenter = 48.74718000000001;
  public yCenter = 55.751716;
  
  public route: number[][] = [];
  public routeDescription: String;

  public pointA: String;
  public pointB: String;

  constructor(public mapService: MapService) { 
    this.pointA = this.mapService.pointA;
    this.pointB = this.mapService.pointB;
  }

  public pointAChanged(event) {
    this.pointA = event.target.value;
  }

  public pointBChanged(event) {
    this.pointB = event.target.value;
  }

  searchRoute() {
    this.mapService.getRoute(this.pointA, this.pointB).then((result) => {
       this.xCenter = result.route[0][0];
       this.yCenter = result.route[0][1];
       this.route = result.route;
       console.log(result);
    });
  }

  ngAfterViewInit() {
    this.searchRoute();
  }

  ngOnInit() {
  }
}
