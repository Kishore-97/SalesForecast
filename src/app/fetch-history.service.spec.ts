import { TestBed } from '@angular/core/testing';

import { FetchHistoryService } from './fetch-history.service';

describe('FetchHistoryService', () => {
  let service: FetchHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
