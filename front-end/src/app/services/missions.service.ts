import { Injectable } from '@angular/core';
import { Repository } from '../models/repository.model';
import { HttpClient } from '@angular/common/http';
import { Mission } from '../models/mission.model';

@Injectable()
export class MissionsService extends Repository<Mission> {

  constructor(public http: HttpClient) { 
    super(http, 'missions');
  }

}
