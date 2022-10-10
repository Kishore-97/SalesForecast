import { TestBed } from '@angular/core/testing';

import { DowloadService } from './dowload.service';

describe('DowloadService', () => {
  let service: DowloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DowloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
