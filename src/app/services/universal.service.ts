import { Injectable } from '@angular/core';
import { Mission } from '../models/mission.model';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UniversalService {

  apiRoot: String = AppSettings.API_ROOT;
  
  isMissionReadOnly: Boolean;
  selectedMission: Mission;
  missions: Array<Mission>;
  constructor(private http: HttpClient) {
    this.missions = [
      { 'id': 1, 'name': 'name 1', 'startDate': '01.05.2018', 'routeStart': '01.05.2018', 'routeFinish': '01.05.2018' },
      { 'id': 2, 'name': 'name 2', 'startDate': '01.05.2018', 'routeStart': '01.05.2018', 'routeFinish': '01.05.2018' },
      { 'id': 3, 'name': 'name 3', 'startDate': '01.05.2018', 'routeStart': '01.05.2018', 'routeFinish': '01.05.2018' },
      { 'id': 4, 'name': 'name 4', 'startDate': '01.05.2018', 'routeStart': '01.05.2018', 'routeFinish': '01.05.2018' },
      { 'id': 5, 'name': 'name 5', 'startDate': '01.05.2018', 'routeStart': '01.05.2018', 'routeFinish': '01.05.2018' }
    ];
  }

  getMax = (): Promise<any> => {
    let promise = new Promise<Number>((resolve, reject) => {
      let max = Math.max.apply(Math, this.missions.map(function(o) { return o['id']; } ));
      resolve(max);
    });
    return promise;
  } 

  getInx = (id:Number): Promise<any> => {
    let promise = new Promise<Number>((resolve, reject) => {
      let m = this.missions.findIndex( m => m.id === id);
      resolve(m);
    });
    return promise;
  }

  filterMissions = (mission:Mission): Promise<any> => {
    let promise = new Promise<Mission[]>((resolve, reject) => {
      const missions = this.missions.filter(m => m.id !== mission.id);
      resolve(missions);
    });
    return promise;
  }

  add(mission: Mission): Promise<any> {
    let promise = new Promise((resolve, reject) => {
        this.getMax().then(res => {
          mission.id = Number(res) + 1;
          this.missions.push(mission);
          resolve(this.missions);
        }, err => reject(err));
    });
    return promise;
  }

  updateMission(mission: Mission): Promise <any> {
    let promise = new Promise((resolve, reject) => {
        this.getInx(mission.id).then(res => {
          this.missions[Number(res)] = mission;
          resolve(this.missions);
        }, err => reject(err));
    });

    return promise;
  }

  deleteMission(mission: Mission): Promise <any> {
    let promise = new Promise((resolve, reject) => {
        this.filterMissions(mission).then(res => {
          this.missions = res;
          resolve(this.missions);
        }, err => reject(err));
    });

    return promise;
  }
}