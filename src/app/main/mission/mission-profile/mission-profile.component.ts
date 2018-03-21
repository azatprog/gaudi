import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Mission } from '../../../models/mission.model';
import { PlatformLocation, Location } from '@angular/common';
import { UniversalService } from '../../../services/universal.service';
import { Vehicle } from '../../../models/vehicle.model';

@Component({
  moduleId: module.id,
  selector: 'app-mission-profile',
  templateUrl: './mission-profile.component.html',
  styleUrls: ['./mission-profile.component.css']
})
export class MissionProfileComponent implements OnInit {

  @ViewChild('f') form: any;
  @ViewChild('missionName') missionName: ElementRef;

  getVehicles = () => {
    let vehs = this.missionService.vehicles.filter(v => this.mission.vehicles.includes(v.id));
    return vehs;
  }

private mission: Mission;
private vehicles: Vehicle[];
private isShowingVehiclePopup: Boolean;

constructor(
            private location: PlatformLocation,
            private _location: Location,
            private missionService: UniversalService,
            private renderer: Renderer
) { 
    if (this.missionService.selectedMission) {
      this.mission = Object.assign({}, this.missionService.selectedMission);
      this.vehicles = this.getVehicles();
    } else {      
      this.mission = new Mission();
      this.vehicles = [];
    }
    
    location.onPopState(() => {
      this.missionService.selectedMission = null;
      this.missionService.isMissionReadOnly = true;
    });
 }

ngOnInit() {
  if (this.missionService.isMissionReadOnly == false){
    this.renderer.invokeElementMethod(this.missionName.nativeElement, 'focus');
  }
}

openVehicleListPopup() {
  this.isShowingVehiclePopup = true;
}

closeVehiclePopup() {
  this.isShowingVehiclePopup = false;
}

selectVehicle(vehicle: Vehicle) {
  if (this.mission.vehicles.includes(vehicle.id)) {
    alert('The vehicle already in this mission');
  } else {
    this.mission.vehicles.push(vehicle.id);
    this.vehicles = this.getVehicles();
    this.missionService.updateVehicle(vehicle).then(res => {
      
    });
  }
  this.closeVehiclePopup();
}

goToMissionList() {
  this._location.back();
  this.missionService.selectedMission = null;
  this.missionService.isMissionReadOnly = true;
}

goToMissionShow() {
  this.missionService.isMissionReadOnly = true;
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
  this.missionService.deleteMission(this.missionService.selectedMission).then(res => {
    alert('deleted');
    this.goToMissionList();
  }).catch(err=> {
      if (err.status == 0) {
          alert('Not bound to server! Check your connection!');
      } else {
          alert(err);
      }
  });   
}  

save() {  
  if (this.mission.id == null) {
    this.missionService.addMission(this.mission).then(res => {
      this.mission = new Mission();
      this.form.reset();
      this.goToMissionList();
    }).catch(err=> {
      if (err.status == 0) {
          alert('Not bound to server! Check your connection!');
        } else {
          alert(err);
        }
    });
  } else {
      this.missionService.updateMission(this.mission).then(updated => {
          this.mission = updated;
          alert('updated');
          this.missionService.selectedMission = null;
          this.goToMissionList();
      }).catch(err=> {
          this.missionService.selectedMission = null;
          this.missionService.isMissionReadOnly = true;
          if (err.status == 0) {
              alert('Not bound to server! Check your connection!');
          } else {
              alert(err);
          }
      });
  }
}

}
