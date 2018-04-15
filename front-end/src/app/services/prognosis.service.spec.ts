import { TestBed, inject } from '@angular/core/testing';

import { PrognosisService } from './prognosis.service';

describe('PrognosisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrognosisService]
    });
  });

  it('should be created', inject([PrognosisService], (service: PrognosisService) => {
    expect(service).toBeTruthy();
  }));
});
