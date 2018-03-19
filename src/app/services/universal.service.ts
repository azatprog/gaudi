import { Injectable } from '@angular/core';
import { Mission } from '../models/mission.model';

@Injectable()
export class UniversalService {

  isMissionReadOnly: Boolean;
  selectedMission: Mission;
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

}
