import { Injectable } from '@angular/core';
import { Mission } from '../models/mission.model';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Vehicle } from '../models/vehicle.model';
import { VehiclesService } from './vehicles.service';
import { MissionsService } from './missions.service';

@Injectable()
export class UniversalService {

  apiRoot: String = AppSettings.API_ROOT;
  isMissionReadOnly: Boolean;
  selectedMission: Mission;
  missions: Array<Mission>;

  isVehicleReadOnly: Boolean;
  selectedVehicle: Vehicle;
  vehicles: Array<Vehicle>;

  constructor(private http: HttpClient,
     public vehiclesService: VehiclesService,
     public missionService: MissionsService) {
    // this.missions = [
    //   { 'id': 1, 'name': 'Humanitarian mission', 'startDate': '01.05.2018', 'routeStart': 'Baghdad', 'routeFinish': 'Kabul', 
    //     'vehicles': [1,4] },
    //   { 'id': 2, 'name': 'Driniking water delivery', 'startDate': '23.05.2018', 'routeStart': 'Berlin', 'routeFinish': 'München', 
    //     'vehicles': [2] },
    //   { 'id': 3, 'name': 'Zica virus recovery', 'startDate': '11.09.2018', 'routeStart': 'Kinshasa', 'routeFinish': 'Kabalo', 
    //     'vehicles': [5] },
    //   { 'id': 4, 'name': 'Hurricane Sud disaster', 'startDate': '08.08.2018', 'routeStart': 'Port-de-Paix', 'routeFinish': 'Cap-Haïtien', 
    //     'vehicles': [] },
    //   { 'id': 5, 'name': 'Earthquake mission', 'startDate': '13.07.2018', 'routeStart': 'Anse-à-Veau', 'routeFinish': 'Camp Perrin', 
    //     'vehicles': [] }
    // ];

    // this.vehicles = [
    //   { 'id': 1, 'type': '4wheeler', 'model': 'Dodge ram 3500', 'sn': 'sn123w3143', 'state': '5', 'mission': { id: 1, name: 'Humanitarian mission' } },
    //   { 'id': 2, 'type': 'truck', 'model': 'Volvo FH', 'sn': 'sn99998343', 'state': '15', 'mission': { id: 2, name: 'Driniking water delivery' } },
    //   { 'id': 3, 'type': 'truck', 'model': 'Volvo FH', 'sn': 'sn4432665', 'state': '25', 'mission': { id: 2, name: 'Driniking water delivery' } },
    //   { 'id': 4, 'type': 'truck', 'model': 'Volvo FH ', 'sn': 'sn443634', 'state': '5', 'mission': { id: 1, name: 'Humanitarian mission' } },
    //   { 'id': 5, 'type': '4wheeler', 'model': 'Dodge ram 3500', 'sn': 'sn16161897', 'state': '35', 'mission': { id: 3, name: 'Zica virus recovery' } }
    // ];
  }

  getMax = (array: Object[]): Promise<any> => {
    let promise = new Promise<Number>((resolve, reject) => {
      let max = Math.max.apply(Math, array.map(function(o) { return o['id']; } ));
      resolve(max);
    });
    return promise;
  } 

  getInx = (id:Number, array: Object[]): Promise<any> => {
    let promise = new Promise<Number>((resolve, reject) => {
      let m = array.findIndex( m => m['id'] === id);
      resolve(m);
    });
    return promise;
  }

  filterArray = (o:Object, array: Object[]): Promise<any> => {
    let promise = new Promise<Object[]>((resolve, reject) => {
      const filtered = array.filter(m => m['id'] !== o['id']);
      resolve(filtered);
    });
    return promise;
  }

  getMissions(): Promise<Mission[]> {
    return this.missionService.getAll();
  }

  addMission(mission: Mission): Promise<Mission> {
    return this.missionService.add(mission);
  }

  updateMission(mission: Mission): Promise <Mission> {
    return this.missionService.update(mission);
  }

  deleteMission(mission: Mission): Promise <void> {
    return this.missionService.delete(mission.id);
  }

  getVehicles(): Promise<Vehicle[]> {
    return this.vehiclesService.getAll();
  }

  addVehicle(vehicle: Vehicle): Promise<Vehicle> {
    return this.vehiclesService.add(vehicle);
  }

  updateVehicle(vehicle: Vehicle): Promise <Vehicle> {
    return this.vehiclesService.update(vehicle);
  }

  deleteVehicle(vehicle: Vehicle): Promise <void> {
    return this.vehiclesService.delete(vehicle.id);
  }
}
