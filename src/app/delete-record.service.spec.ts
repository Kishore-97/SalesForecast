import { TestBed } from '@angular/core/testing';

import { DeleteRecordService } from './delete-record.service';

describe('DeleteRecordService', () => {
  let service: DeleteRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
