import { Injectable } from '@angular/core';
import { Repository } from '../models/repository.model';
import { VehicleStatus } from '../models/vehicleStatus.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VehicleStatusService extends Repository<VehicleStatus> {

  private missionId: number;
  private vehicleId: number;

  constructor(public http: HttpClient) {
    super(http, 'vehicleStatus');
  }

  public setMissionId(missionId: number) {
    this.missionId = missionId;
  }

  public setVehicleId(vehicleId: number) {
    this.vehicleId = vehicleId;
  }

  public getVehicleStatus(data?: number): Promise<VehicleStatus[]> {
    let path = this.path + '?vehicleId=' + this.vehicleId + '&missionId=' + this.missionId;
    if (data) {
      path += '&timeFromMissionStart=' + data;
    }
    return this.executeQuery(path, 'get');
  }
}
