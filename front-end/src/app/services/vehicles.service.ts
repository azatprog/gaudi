import { Injectable } from '@angular/core';
import { Repository } from '../models/repository.model';
import { Vehicle } from '../models/vehicle.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VehiclesService extends Repository<Vehicle> {

  constructor(public http: HttpClient) {
    super(http, 'vehicles');
    // const vehicle = new Vehicle();
    // this.save(vehicle).then((v) => {
    //   console.log(v);
    //   alert('saved');
    // });
  }

}
