import { TestBed } from '@angular/core/testing';

import { PatientLoactionService } from './patient-loaction.service';

describe('PatientLoactionService', () => {
  let service: PatientLoactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientLoactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
