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

  constructor(private route: Router, private missionService: UniversalService) { 
    this.missions = this.missionService.missions;
  }

  ngOnInit() {
  }

  createMission() {
    this.missionService.selectedMission = null;
    this.missionService.isMissionReadOnly = false;
    this.route.navigate(['/app/main/missionProfile']);
  }

}
