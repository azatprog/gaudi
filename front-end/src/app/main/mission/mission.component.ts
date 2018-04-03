import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UniversalService } from '../../services/universal.service';
import { Mission } from '../../models/mission.model';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css']
})
export class MissionComponent implements OnInit {

  missions: Array<Mission>;

  constructor(private route: Router,
     public missionService: UniversalService) {
  }

  ngOnInit() {
    this.missionService.getMissions().then((ms) => { this.missions = ms; });
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
