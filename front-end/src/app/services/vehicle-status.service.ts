import { Injectable } from '@angular/core';
import { Repository } from '../models/repository.model';
import { VehicleStatus } from '../models/vehicleStatus.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VehicleStatusService extends Repository<VehicleStatus> {

  constructor(public http: HttpClient) {
    super(http, 'vehicleStatus');
  }

  public getVehicleStatus(vehicleId: number, missionId: number, data?: number): Promise<VehicleStatus[]> {
    return this.executeQuery(this.path, 'get', {vehicleId, missionId, data});
  }

}
