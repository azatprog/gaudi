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
    public mapService: MapService
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

  selectVehicle(vehicle: Vehicle) {
    if (this.missionService.isDuplication(vehicle, this.mission.vehicles)) {
      alert('The vehicle already in this mission');
    } else {
      this.mission.vehicles.push(vehicle);
    }
    this.closePopup('isShowingVehiclePopup');
  }

  identify = (inx, item) => inx;

  addSegment() {
    if (this.mission.route.noneNormalSegments.length === 0) {
      this.theSegmentValue = new RouteSegment();
      this.theSegmentValue.start = 0;
      this.theSegmentValue.distance = 0;
      this.theSegmentValue.condition = 'NORMAL';
    } else {
      const len = this.mission.route.noneNormalSegments.length;
      this.theSegmentValue = new RouteSegment();
      this.theSegmentValue.start = this.mission.route.noneNormalSegments[len - 1].start + this.mission.route.noneNormalSegments[len - 1].distance;
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

  remVehicle(vehicle: Vehicle) {
    this.missionService.filterArray(vehicle, this.vehicles).then(res => {
      this.mission.vehicles = res;
    });
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
    this.mapService
      .getRoute(this.mission.route.start, this.mission.route.end)
      .then((res: RouteDetails) => {
        this.mission.route = res;
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
      });
  }
}
