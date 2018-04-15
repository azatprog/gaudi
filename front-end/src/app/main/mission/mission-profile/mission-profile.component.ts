import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer
} from '@angular/core';
import {ReactiveFormsModule, FormArray, FormBuilder} from '@angular/forms';
import { Mission } from '../../../models/mission.model';
import { PlatformLocation, Location } from '@angular/common';
import { UniversalService } from '../../../services/universal.service';
import { Vehicle } from '../../../models/vehicle.model';
import { Router } from '@angular/router';
import { MapService  } from '../../../services/map.service';
import { RouteDetails } from '../../../models/routedetails.model';
import { RouteSegment } from '../../../models/routeSegment.model';
import { VehicleStatusService } from '../../../services/vehicle-status.service';
import { LatestVehicleStatus } from '../../../models/latestVehicleStatus.model';
import { PrognosisService, VehicleFailureProbability } from '../../../services/prognosis.service';

@Component({
  moduleId: module.id,
  selector: 'app-mission-profile',
  templateUrl: './mission-profile.component.html',
  styleUrls: ['./mission-profile.component.css']
})
export class MissionProfileComponent implements OnInit {
  @ViewChild('f') form: any;
  @ViewChild('missionName') missionName: ElementRef;
  public mission: Mission;
  public vehicles: Vehicle[];
  public isShowingVehiclePopup: boolean;
  public isShowingSegmentPopup: boolean;

  theSegmentValue: RouteSegment;
  isNewSegment: boolean;

  constructor(
    private location: PlatformLocation,
    private _location: Location,
    private route: Router,
    public missionService: UniversalService,
    private renderer: Renderer,
    public mapService: MapService,
    public prognosisService: PrognosisService,
    public mainService: UniversalService
  ) {
    if (this.missionService.selectedMission) {
      this.mission = Object.assign({}, this.missionService.selectedMission);
      console.log(this.mission);
    } else {
      this.mission = new Mission();
    }

    location.onPopState(() => {
      this.missionService.selectedMission = null;
      this.missionService.isMissionReadOnly = true;
    });
  }

  ngOnInit() {
    if (this.missionService.isMissionReadOnly === false) {
      this.renderer.invokeElementMethod(
        this.missionName.nativeElement,
        'focus'
      );
    }
  }

  onSegment() {
    
  }

  openPopup(popupName: string) {
    this[popupName] = true;
  }

  closePopup(popupName: string) {
    this[popupName] = false;
  }

  selectVehicle(vehicle: Vehicle) {
    if (this.missionService.isDuplication(vehicle, this.mission.vehicles)) {
      alert('The vehicle already in this mission');
    } else {
        this.prognosisService.getFailureProbabilities(vehicle, this.mission.route)
        .then((result) => {
          this.fillVehicleProbabilities(vehicle, result);
          this.mission.vehicles.push(vehicle);
          this.setVehicleStyles();
      });
    }
    this.closePopup('isShowingVehiclePopup');
  }

  decisionSupport() {
    if (this.mission.vehicles.length > 0)
       return;

    this.mainService.getVehicles().then((vehicles) => {
      for( let i = 0; i < vehicles.length; i++) {
        const vehicle = vehicles[i];
        this.prognosisService.getFailureProbabilities(vehicle, this.mission.route)
          .then((result) => {
            this.fillVehicleProbabilities(vehicle, result);
            this.mission.vehicles.push(vehicle);
            this.orderVehicles();
        });
      }
    });
  }

  orderVehicles() {
    this.mission.vehicles = this.mission.vehicles.sort(this.compareVehicles);
    this.setVehicleStyles();
  }

  setVehicleStyles() {
    const FAILURE = 1;
    const SUCCESS = 2;
    const vehicles = this.mission.vehicles;
    for( let i = 0; i < vehicles.length; i++) {
      const vehicle = vehicles[i];
      if (vehicle['probEngine'] > 50 || 
          vehicle['probBrake'] > 50 || 
          vehicle['probGear'] > 50) {
            vehicle['state'] = FAILURE; 
      }
      else {
        vehicle['state'] = SUCCESS;
      }
    }
  }

  compareVehicles(a: Vehicle, b: Vehicle): number {
    let comparison = 0;
    const aTotalFailure = (a['probEngine'] * a['probGear'] * a['probBrake']) / 100;
    const bTotalFailure = (b['probEngine'] * b['probGear'] * b['probBrake']) / 100;

    if (aTotalFailure > bTotalFailure) {
      comparison = 1;
    } else if (bTotalFailure > aTotalFailure) {
      comparison = -1;
    }
  
    return comparison;
  }

  identify = (inx, item) => inx;

  private fillVehicleProbabilities(vehicle: Vehicle, result: VehicleFailureProbability) {
    vehicle['probBrake'] = result.probBrake;
    vehicle['probEngine'] = result.probEngine;
    vehicle['probGear'] = result.probGear;
  }

  addVehicle() {
    this.openPopup('isShowingVehiclePopup');
  }

  addSegment() {
    if (this.mission.route.noneNormalSegments.length === 0) {
      this.theSegmentValue = new RouteSegment();
      this.theSegmentValue.start = 0;
      this.theSegmentValue.distance = 0;
      this.theSegmentValue.condition = 'NORMAL';
    } else {
      const len = this.mission.route.noneNormalSegments.length;
      this.theSegmentValue = new RouteSegment();
      this.theSegmentValue.start =
        this.mission.route.noneNormalSegments[len - 1].start +
        this.mission.route.noneNormalSegments[len - 1].distance;
      this.theSegmentValue.distance = 0;
      this.theSegmentValue.condition = 'NORMAL';
    }
    this.isNewSegment = true;
    this.openPopup('isShowingSegmentPopup');
  }

  remSegment(inx) {
    this.mission.route.noneNormalSegments.splice(inx, 1);
  }

  editSegment(s: RouteSegment) {
    this.isNewSegment = false;
    this.theSegmentValue = s;
    this.openPopup('isShowingSegmentPopup');
  }

  saveSegment(s) {
    if (this.isNewSegment) {
      this.mission.route.noneNormalSegments.push(s);
    }
  }

  onSelectRootVehicle() {}

  remVehicle(inx: number) {
    this.mission.vehicles.splice(inx, 1);
  }

  goToMissionList() {
    this._location.back();
    this.missionService.selectedMission = null;
    this.missionService.isMissionReadOnly = true;
  }

  goToMissionShow() {
    this.missionService.isMissionReadOnly = true;
  }

  showOnMap() {
    this.missionService.isMissionReadOnly = true;
    this.mapService.start = this.missionService.selectedMission.route.start;
    this.mapService.end = this.missionService.selectedMission.route.end;
    this.route.navigate(['/app/main/map']);
  }

  cancel() {
    if (this.missionService.selectedMission === null) {
      this.goToMissionList();
    } else {
      this.mission = this.missionService.selectedMission;
      this.goToMissionShow();
    }
  }

  editMission() {
    this.missionService.isMissionReadOnly = false;
    this.renderer.invokeElementMethod(this.missionName.nativeElement, 'focus');
  }

  delMission() {
    this.missionService
      .deleteMission(this.missionService.selectedMission)
      .then(res => {
        alert('deleted');
        this.goToMissionList();
      })
      .catch(err => {
        if (err.status === 0) {
          alert('Not bound to server! Check your connection!');
        } else {
          alert(err);
        }
      });
  }

  save() {
    const segments = this.mission.route.noneNormalSegments;
    this.mission.route.noneNormalSegments = segments;
    if (this.mission.id == null) {
      this.missionService
        .addMission(this.mission)
        .then(res => {
          this.mission = new Mission();
          this.form.reset();
          this.goToMissionList();
        })
        .catch(err => {
          if (err.status === 0) {
            alert('Not bound to server! Check your connection!');
          } else {
            alert(err);
          }
        });
    } else {
      console.log(this.mission);
      this.missionService
        .updateMission(this.mission)
        .then(updated => {
          alert('updated');
          this.goToMissionList();
        })
        .catch(err => {
          this.missionService.selectedMission = null;
          this.missionService.isMissionReadOnly = true;
          if (err.status === 0) {
            alert('Not bound to server! Check your connection!');
          } else {
            alert(err);
          }
        });
    }
  }

  onStartRouteChange(event) {
    if (this.mission.route.end === null) {
      return;
    }

    this.mapService
    .getRoute(this.mission.route.start, this.mission.route.end)
    .then((res: RouteDetails) => {
      this.mission.route = res;
    });
  }

  onFinishRouteChange(event) {
    if (this.mission.route.start === null) {
      return;
    }

    this.mapService
    .getRoute(this.mission.route.start, this.mission.route.end)
    .then((res: RouteDetails) => {
      this.mission.route = res;
    });
  }
}
