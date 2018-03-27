import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  public zoom = 5;
  public opacity = 1.0;
  public width = 5;

  // Innopolis coordinates
  public xCenter = 48.74718000000001;
  public yCenter = 55.751716;
  
  public route: number[][] = [];
  public routeDescription: String;

  public pointA: String;
  public pointB: String;
  xPointA: Number;
  yPointA: Number;
  xPointB: Number;
  yPointB: Number;
  
  xMove?: Number;
  yMove?: Number;

  constructor(public mapService: MapService, 
              private ref: ChangeDetectorRef) { 
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
      let center = Math.round(result.route.length / 2);
      const last = result.route.length - 1;
       this.xCenter = result.route[center][0];
       this.yCenter = result.route[center][1];
       this.xMove = result.route[0][0];
       this.yMove = result.route[0][1];
       this.xPointA = result.route[0][0];
       this.yPointA = result.route[0][1];
       this.xPointB = result.route[last][0];
       this.yPointB = result.route[last][1];
       this.route = result.route;
       console.log(result);
    });
  }

  ngAfterViewInit() {
    this.searchRoute();
  }

  ngOnInit() {
  }

  increaseZoom() {
    this.zoom  = Math.min(this.zoom + 1, 18);
  }

  decreaseZoom() {
    this.zoom  = Math.max(this.zoom - 1, 1);
  }

  startConvoy() {
    var count = 0;
    var route = this.route;
    var timerId = setInterval(()=> {
      this.xMove = route[count][0];
      this.yMove = route[count][1];
      this.ref.detectChanges();

      count++;
      if (count >= route.length) {
        clearInterval(timerId);
      }
    }, 600);
  }
}
