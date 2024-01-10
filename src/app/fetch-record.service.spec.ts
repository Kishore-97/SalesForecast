import { TestBed } from '@angular/core/testing';

import { FetchRecordService } from './fetch-record.service';

describe('FetchRecordService', () => {
  let service: FetchRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
