import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css']
})
export class MissionComponent implements OnInit {

  missions: Array<Object>;

  constructor() { 
    this.missions = [
      { 'name': 'name 1', 'startDate': '01.05.2018', 'routeStart': '01.05.2018', 'routeFinish': '01.05.2018' },
      { 'name': 'name 2', 'startDate': '01.05.2018', 'routeStart': '01.05.2018', 'routeFinish': '01.05.2018' },
      { 'name': 'name 3', 'startDate': '01.05.2018', 'routeStart': '01.05.2018', 'routeFinish': '01.05.2018' },
      { 'name': 'name 4', 'startDate': '01.05.2018', 'routeStart': '01.05.2018', 'routeFinish': '01.05.2018' },
      { 'name': 'name 5', 'startDate': '01.05.2018', 'routeStart': '01.05.2018', 'routeFinish': '01.05.2018' }
    ];
  }

  ngOnInit() {
  }

}
