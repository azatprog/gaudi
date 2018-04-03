import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MapService } from '../services/map.service';
import { RouteDetails } from '../models/routedetails.model';
import { VehicleStatusService } from '../services/vehicle-status.service';
import { UniversalService } from '../services/universal.service';
import { Mission } from '../models/mission.model';
import { Vehicle } from '../models/vehicle.model';

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

  public start: String;
  public end: String;
  xPointA: Number;
  yPointA: Number;
  xPointB: Number;
  yPointB: Number;
  
  xMove?: Number;
  yMove?: Number;

  mission: Mission;

  constructor(public mapService: MapService,
              private ref: ChangeDetectorRef,
              public vehicleStatusService: VehicleStatusService,
              public vehicleService: UniversalService
            ) {
    this.start = this.mapService.start;
    this.end = this.mapService.end;
    this.mission = this.vehicleService.selectedMission;
  }

  public pointAChanged(event) {
    this.start = event.target.value;
  }

  public pointBChanged(event) {
    this.end = event.target.value;
  }

  identify = (inx, item) => inx;

  searchRoute() {
    this.mapService.getRoute(this.start, this.end).then((result: RouteDetails) => {
      const center = Math.round(result.points.length / 2);
      const last = result.points.length - 1;
       this.route = result.points.map(p => [p.lng, p.lat]);
       this.xCenter = this.route[center][0];
       this.yCenter = this.route[center][1];
       this.xMove = this.route[0][0];
       this.yMove = this.route[0][1];
       this.xPointA = this.route[0][0];
       this.yPointA = this.route[0][1];
       this.xPointB = this.route[last][0];
       this.yPointB = this.route[last][1];
       
       console.log(result);
    });
  }

  ngAfterViewInit() {
    this.searchRoute();
  }

  ngOnInit() {
  }

  getVehicleStatus(v: Vehicle) {
    Array.from(document.getElementsByClassName('.vrow')).forEach(r => {
      r.classList.remove('.selected');
    });
    this.vehicleStatusService.getVehicleStatus(this.mission.id, v.id).then((res) => {
      document.getElementById('vrow' + v.id).classList.add('selected');
    });
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
