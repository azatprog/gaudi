import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MapService } from '../services/map.service';
import { RouteDetails } from '../models/routedetails.model';
import { VehicleStatusService } from '../services/vehicle-status.service';
import { UniversalService } from '../services/universal.service';
import { Mission } from '../models/mission.model';
import { Vehicle } from '../models/vehicle.model';
import { Point } from '../models/point.model';
import { VehicleStatus } from '../models/vehicleStatus.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  currentVehicleId: number;
  timerId: any;
  public zoom = 9;
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
  
  vehiclePositionsMap: Map<number, Point>;
  vehiclePositions: Array<Point> = [];
  currentVehicleStatus: VehicleStatus[] = [];

  mission: Mission;

  constructor(public mapService: MapService,
              private ref: ChangeDetectorRef,
              public vehicleStatusService: VehicleStatusService,
              public vehicleService: UniversalService
            ) {
    this.start = this.mapService.start;
    this.end = this.mapService.end;
    this.mission = this.vehicleService.selectedMission;
    this.vehiclePositionsMap = new Map<number, Point>();
    this.vehicleStatusService.setMissionId(this.mission.id);
  }

  public pointAChanged(event) {
    this.start = event.target.value;
  }

  public pointBChanged(event) {
    this.end = event.target.value;
  }

  identify = (inx, item) => inx;

  initializeMap() {
       const result = this.mission.route;
       const center = Math.round(result.points.length / 2);
       const last = result.points.length - 1;
       this.route = result.points.map(p => [p.lng, p.lat]);
       this.xCenter = this.route[center][0];
       this.yCenter = this.route[center][1];
       this.xPointA = this.route[0][0];
       this.yPointA = this.route[0][1];
       this.xPointB = this.route[last][0];
       this.yPointB = this.route[last][1];
  }

  ngAfterViewInit() {
    this.initializeMap();
    this.getVehicleStatus(this.mission.vehicles[0]);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.timerId)
      clearInterval(this.timerId);
  }

  getVehicleStatus(v: Vehicle) {
    //TODO: fix class
    Array.from(document.getElementsByClassName('.vrow')).forEach(r => {
      r.classList.remove('.selected');
    });
    document.getElementById('vrow' + v.id).classList.add('selected');
    this.currentVehicleId = v.id;
    this.startConvoy();
  }

  getGetPositions() {
    for(let i = 0; i < this.mission.vehicles.length; i++) {
      const vehicle = this.mission.vehicles[i];
      
      this.vehicleStatusService.setVehicleId(vehicle.id)
      this.vehicleStatusService.getVehicleStatus().then((res) => {
        const l = res.length;
        if (l == 0)
           return;
        if (this.currentVehicleId == vehicle.id) {
          this.currentVehicleStatus = res;
        }
        this.vehiclePositionsMap.set(vehicle.id, new Point(res[l - 1].lng, res[l - 1].lat));
        this.vehiclePositions = Array.from(this.vehiclePositionsMap.values());
        this.ref.detectChanges();
      });
    }
  }

  increaseZoom() {
    this.zoom  = Math.min(this.zoom + 1, 18);
  }

  decreaseZoom() {
    this.zoom  = Math.max(this.zoom - 1, 1);
  }

  startConvoy() {
     this.timerId = setInterval(()=> {
      this.getGetPositions();
    }, 1000);
  }
}
