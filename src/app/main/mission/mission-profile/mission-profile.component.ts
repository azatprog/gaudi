import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Mission } from '../../../models/mission.model';
import { PlatformLocation, Location } from '@angular/common';
import { UniversalService } from '../../../services/universal.service';

@Component({
  selector: 'app-mission-profile',
  templateUrl: './mission-profile.component.html',
  styleUrls: ['./mission-profile.component.css']
})
export class MissionProfileComponent implements OnInit {

  @ViewChild('f') form: any;
  @ViewChild('missionName') missionName: ElementRef;

private mission: Mission;
constructor(
            private location: PlatformLocation,
            private _location: Location,
            private missionService: UniversalService,
            private renderer: Renderer
) { 
    if (this.missionService.selectedMission) {
      this.mission = Object.assign({}, this.missionService.selectedMission);
    } else {      
      this.mission = new Mission();
      console.log(this.mission);
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
    console.log('cancel');
    this.goToMissionList();
  } else {
    console.log('cancel');
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
    console.log('in save');
    this.missionService.add(this.mission).then(res => {
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
