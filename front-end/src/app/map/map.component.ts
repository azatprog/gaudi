import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MapService } from '../services/map.service';
import { RouteDetails } from '../models/routedetails.model';
import { VehicleStatusService } from '../services/vehicle-status.service';
import { UniversalService } from '../services/universal.service';
import { Mission } from '../models/mission.model';
import { Vehicle } from '../models/vehicle.model';
import { Point } from '../models/point.model';
import { VehicleStatus } from '../models/vehicleStatus.model';
import { color } from 'openlayers';
// import { 
//   setInterval,
//   clearInterval
// } from 'timers';

export class VehicleAggregation {
  pos: Point;
  name: string;
  color: string;
  message: string;

  update(status: VehicleStatus) {
    this.color = 'green';
    this.message = '';

    const date = new Date().toTimeString().split(" ")[0];

    if (status.engineFault) {
      this.color = 'red';
      this.message = date+ ': Engine fault';
    }

    if (status.gearFault) {
      this.color = 'red';
      this.message = date + ': Gear fault';
    }

    if (status.brakeFault) {
      this.color = 'red';
      this.message = date + ': Brake fault';
    }
  }

  constructor(status: VehicleStatus, name: string) {
    this.color = 'green';
    this.name = name;
    this.pos = new Point(status.lng, status.lat);
    this.update(status);
  }
}

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
  public width = 2;

  public xCenter;
  public yCenter;
  
  public route: number[][] = [];
  public routeDescription: String;

  public start: String;
  public end: String;
  xPointA: Number;
  yPointA: Number;
  xPointB: Number;
  yPointB: Number;
  
  vehiclePositionsMap: Map<number, VehicleAggregation>;
  vehiclePositions: Array<VehicleAggregation> = [];
  currentVehicleStatus: VehicleStatus[] = [];
  startfromMission: Map<number, number>;

  mission: Mission;

  constructor(public mapService: MapService,
              private ref: ChangeDetectorRef,
              public vehicleStatusService: VehicleStatusService,
              public vehicleService: UniversalService
            ) {
    this.start = this.mapService.start;
    this.end = this.mapService.end;
    this.mission = this.vehicleService.selectedMission;
    this.vehiclePositionsMap = new Map<number, VehicleAggregation>();
    this.startfromMission = new Map<number, number>();
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
    Array.from(document.querySelectorAll('.vrow')).forEach(r => {
      r.classList.remove('selected');
    });
    document.getElementById('vrow' + v.id).classList.add('selected');

    if (this.currentVehicleStatus.length > 0) {
        const pos = this.currentVehicleStatus[this.currentVehicleStatus.length - 1];
        this.xCenter = pos.lng;
        this.yCenter = pos.lat;
        if (this.ref)
          this.ref.detectChanges();
    }
    if (this.currentVehicleId != v.id) {
       this.currentVehicleStatus = new Array();
       this.startfromMission = new Map();
    }
    this.currentVehicleId = v.id;
    this.startConvoy();
  }

  getGetPositions() {
    for(let i = 0; i < this.mission.vehicles.length; i++) {
      const vehicle = this.mission.vehicles[i];

      let lastTime = null;
      if (this.startfromMission.has(vehicle.id))
         lastTime = this.startfromMission.get(vehicle.id);

      this.vehicleStatusService.setVehicleId(vehicle.id)
      this.vehicleStatusService.getVehicleStatus(lastTime).then((res) => {
        const l = res.length;
       
        if (l == 0)
           return;
        if (this.currentVehicleId == vehicle.id) {
          this.currentVehicleStatus = this.currentVehicleStatus.concat(res);
        }

        let currentStatus = res[l - 1];
        let va =  new VehicleAggregation(currentStatus, vehicle.model);
        this.startfromMission.set(vehicle.id, currentStatus.timeFromMissionStart);

        if (this.vehiclePositionsMap.has(vehicle.id)) {
          const lastStatus = this.vehiclePositionsMap.get(vehicle.id);
          if (lastStatus.message.length > 0) {
            lastStatus.pos = va.pos;
            va = lastStatus;
          }
        }
        this.vehiclePositionsMap.set(vehicle.id, va);
        this.vehiclePositions = Array.from(this.vehiclePositionsMap.values());
        if (this.ref)
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
    if (this.timerId)
        return;

     this.timerId = setInterval(()=> {
      this.getGetPositions();
    }, 1000);
  }
}
