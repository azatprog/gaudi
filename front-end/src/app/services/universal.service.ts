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

  isDuplication = (o: Object, array: Object[]): boolean => {
    const res = array.findIndex(a => a['id'] === o['id']) > -1;
    return res;
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
