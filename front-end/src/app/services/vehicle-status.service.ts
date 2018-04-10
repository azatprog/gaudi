import { Injectable } from '@angular/core';
import { Repository } from '../models/repository.model';
import { VehicleStatus } from '../models/vehicleStatus.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VehicleStatusService extends Repository<VehicleStatus> {

  private static missionId: number;
  private static vehicleId: number;

  constructor(public http: HttpClient) {
    super(http, 'vehicleStatus');
  }

  public setMissionId(id: number) {
    VehicleStatusService.missionId = id;
  }

  public setVehicleId(id: number) {
    VehicleStatusService.vehicleId = id;
  }

  public getVehicleStatus(data?: number): Promise<VehicleStatus[]> {
    let path = this.path + '?vehicleId=' + VehicleStatusService.vehicleId + '&missionId=' + VehicleStatusService.missionId;
    if (data) {
      path += '&timeFromMissionStart=' + data;
    }
    return this.executeQuery(path, 'get');
  }
}
