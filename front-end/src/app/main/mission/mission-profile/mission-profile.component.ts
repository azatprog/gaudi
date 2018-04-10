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
  coefcient =
    {
      'NORMAL':
      {
        'cumulBrakePedalPushingWeight': 196.41,
        'cumulBrakeHighTempOperation': 0.44,
        'cumulDescentMileage': 0.01605,

        'cumulEngineOperation': 64.1,
        'cumulEngineHighLoadOperation': 10.85,
        'cumulEngineHighTempOperation': 0.02,

        'cumulGearOperation': 57.07,
        'cumulGearHighLoadOperation': 24.66
      },
      'MOUNTAINS':
      {
        'cumulBrakePedalPushingWeight': 687.435,
        'cumulBrakeHighTempOperation': 1.32,
        'cumulDescentMileage': 0.040125,

        'cumulEngineOperation': 0.0,
        'cumulEngineHighLoadOperation': 0.0,
        'cumulEngineHighTempOperation': 0.0,

        'cumulGearOperation': 57.07,
        'cumulGearHighLoadOperation': 24.66
      },
      'SWAMP':
      {
        'cumulBrakePedalPushingWeight': 0.0,
        'cumulBrakeHighTempOperation': 0.0,
        'cumulDescentMileage': 0.0,

        'cumulEngineOperation': 192.3,
        'cumulEngineHighLoadOperation': 43.4,
        'cumulEngineHighTempOperation': 0.08,

        'cumulGearOperation': 57.07,
        'cumulGearHighLoadOperation': 24.66
      },
      'WET_FIELD':
      {
        'cumulBrakePedalPushingWeight': 451.743,
        'cumulBrakeHighTempOperation': 0.836,
        'cumulDescentMileage': 0.017655,
        'cumulEngineOperation': 121.79,
        'cumulEngineHighLoadOperation': 24.4125,
        'cumulEngineHighTempOperation': 0.04,
        'cumulGearOperation': 142.675,
        'cumulGearHighLoadOperation': 49.32
      },
      'DRY_FIELD':
      {
        'cumulBrakePedalPushingWeight': 432.102,
        'cumulBrakeHighTempOperation': 0.748,
        'cumulDescentMileage': 0.017655,
        'cumulEngineOperation': 115.38,
        'cumulEngineHighLoadOperation': 21.7,
        'cumulEngineHighTempOperation': 0.034,
        'cumulGearOperation': 114.14,
        'cumulGearHighLoadOperation': 41.922
      },
      'GROUND_ROAD':
      {
        'cumulBrakePedalPushingWeight': 530.307,
        'cumulBrakeHighTempOperation': 1.056,
        'cumulDescentMileage': 0.030495,
        'cumulEngineOperation': 96.15,
        'cumulEngineHighLoadOperation': 15.19,
        'cumulEngineHighTempOperation': 0.038,
        'cumulGearOperation': 85.605,
        'cumulGearHighLoadOperation': 34.524
      },
      'HIGH_WAY':
      {
        'cumulBrakePedalPushingWeight': 0.0,
        'cumulBrakeHighTempOperation': 0.0,
        'cumulDescentMileage': 0.0,
        'cumulEngineOperation': 0.0,
        'cumulEngineHighLoadOperation': 0.0,
        'cumulEngineHighTempOperation': 0.0,
        'cumulGearOperation': 0.0,
        'cumulGearHighLoadOperation': 0.0
      },
      'DESERT':
      {
        'cumulBrakePedalPushingWeight': 255.333,
        'cumulBrakeHighTempOperation': 0.528,
        'cumulDescentMileage': 0.017655,
        'cumulEngineOperation': 128.2,
        'cumulEngineHighLoadOperation': 24.955,
        'cumulEngineHighTempOperation': 0.066,
        'cumulGearOperation': 85.605,
        'cumulGearHighLoadOperation': 29.592
      }
  };

  constructor(
    private location: PlatformLocation,
    private _location: Location,
    private route: Router,
    public missionService: UniversalService,
    private renderer: Renderer,
    public mapService: MapService,
    public vehicleStatusService: VehicleStatusService
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
    console.log(this.mission);
  }

  openPopup(popupName: string) {
    this[popupName] = true;
  }

  closePopup(popupName: string) {
    this[popupName] = false;
  }

  calcCumul = (len: number, key: string, coef: string) => len * this.coefcient[key][coef];

  selectVehicle(vehicle: Vehicle) {
    if (this.missionService.isDuplication(vehicle, this.mission.vehicles)) {
      alert('The vehicle already in this mission');
    } else {
      this.vehicleStatusService.getLatestVehicleStatus(vehicle.id).then((latestVehicleStatus: LatestVehicleStatus) => {
            const routeDistance = Math.round(this.mission.route.distance / 1000);
            const lengthByType = this.getLengthByType(this.mission.route.noneNormalSegments);
              let brakeDamage = 0,
                  engineDamage = 0,
                  gearDamage = 0;
              let pedalPush = 0,
                  highTemp = 0,
                  decentMil = 0;
              let engOper = 0,
                  engTemp = 0,
                  engLoad = 0;
              let gearOper = 0,
                  gearLoad = 0;

              let totalSegmentDistance = 0;
              Object.keys(lengthByType).forEach(k => {
                pedalPush += this.calcCumul(lengthByType[k], k, 'cumulBrakePedalPushingWeight');
                highTemp += this.calcCumul(lengthByType[k], k, 'cumulBrakeHighTempOperation');
                decentMil += this.calcCumul(lengthByType[k], k, 'cumulDescentMileage');

                engOper += this.calcCumul(lengthByType[k], k, 'cumulEngineOperation');
                engTemp += this.calcCumul(lengthByType[k], k, 'cumulEngineHighTempOperation');
                engLoad += this.calcCumul(lengthByType[k], k, 'cumulEngineHighLoadOperation');

                gearOper += this.calcCumul(lengthByType[k], k, 'cumulGearOperation');
                gearLoad += this.calcCumul(lengthByType[k], k, 'cumulGearHighLoadOperation');

                totalSegmentDistance += lengthByType[k];
              });

              pedalPush +=  latestVehicleStatus.cumulBrakePedalPushingWeight +
                            this.calcCumul((routeDistance - totalSegmentDistance), 'NORMAL', 'cumulBrakePedalPushingWeight');
              highTemp += latestVehicleStatus.cumulBrakeHighTempOperation +
                          this.calcCumul((routeDistance - totalSegmentDistance), 'NORMAL', 'cumulBrakeHighTempOperation');
              decentMil += latestVehicleStatus.cumulDescentMileage +
                           this.calcCumul((routeDistance - totalSegmentDistance), 'NORMAL', 'cumulDescentMileage');

              engOper += latestVehicleStatus.cumulEngineOperation +
                          this.calcCumul((routeDistance - totalSegmentDistance), 'NORMAL', 'cumulEngineOperation');
              engTemp += latestVehicleStatus.cumulEngineHighTempOperation +
                          this.calcCumul((routeDistance - totalSegmentDistance), 'NORMAL', 'cumulEngineHighTempOperation');
              engLoad += latestVehicleStatus.cumulEngineHighLoadOperation +
                          this.calcCumul((routeDistance - totalSegmentDistance), 'NORMAL', 'cumulEngineHighLoadOperation');

              gearOper += latestVehicleStatus.cumulGearOperation +
                          this.calcCumul((routeDistance - totalSegmentDistance), 'NORMAL', 'cumulGearOperation');
              gearLoad += latestVehicleStatus.cumulGearHighLoadOperation +
                          this.calcCumul((routeDistance - totalSegmentDistance), 'NORMAL', 'cumulGearHighLoadOperation');

              brakeDamage = this.calcDamage(pedalPush, highTemp, decentMil, 400000, 144000);
              engineDamage = this.calcDamage(engOper, engTemp, engLoad, 100, 10);
              gearDamage = this.calcDamage(gearOper, gearLoad);

              console.log(brakeDamage, engineDamage, gearDamage);
              const probBrake = Math.round((1 / (1 + Math.exp(-0.0000007 * (brakeDamage - 7200000)))) * 100);
              const probEngine = Math.round((1 / (1 + Math.exp(-0.00003 * (engineDamage - 120000)))) * 100);
              const probGear = Math.round((1 / (1 + Math.exp(-0.00005 * (gearDamage - 90000)))) * 100);
              console.log(probBrake, probEngine, probGear);

              vehicle['probBrake'] = probBrake;
              vehicle['probEngine'] = probEngine;
              vehicle['probGear'] = probGear;
            this.mission.vehicles.push(vehicle);
      });
    }
    this.closePopup('isShowingVehiclePopup');
  }

  identify = (inx, item) => inx;

  calcDamage = ( cumul1: number, cumul2: number, cumul3: number = null, k1?: number, k2?: number) => {
    const v = (cumul3 !== null) ?
              ( cumul1 +
                k1 * cumul2 +
                k2 * cumul3 )
              : ( cumul1 +
                10 * cumul2 );
    return v;
  }

  getLengthByType = (segments: RouteSegment[]) => {
    const lengthByType = {};
    segments.forEach(s => {
      lengthByType[s.condition] = (lengthByType[s.condition] || 0) + s.distance;
    });
    return lengthByType;
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
