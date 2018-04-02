import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UniversalService } from '../../services/universal.service';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css']
})
export class MissionComponent implements OnInit {

  missions: Array<Object>;

  constructor(private route: Router,
     public missionService: UniversalService) { 
  }

  ngOnInit() {
    //this.missionService.getMissions().then((ms) => this.missions = ms);
    this.missions = this.missionService.missions;
  }

  createMission() {
    this.missionService.selectedMission = null;
    this.missionService.isMissionReadOnly = false;
    this.route.navigate(['/app/main/missionProfile']);
  }

  identify = (inx, item) => inx;

  edit(mission) {
    this.missionService.selectedMission = mission;
    this.missionService.isMissionReadOnly = true;
    this.route.navigate(['/app/main/missionProfile']);
  }

}
