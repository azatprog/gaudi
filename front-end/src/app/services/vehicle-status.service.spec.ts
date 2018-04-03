import { TestBed, inject } from '@angular/core/testing';

import { VehicleStatusService } from './vehicle-status.service';

describe('VehicleStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VehicleStatusService]
    });
  });

  it('should be created', inject([VehicleStatusService], (service: VehicleStatusService) => {
    expect(service).toBeTruthy();
  }));
});
