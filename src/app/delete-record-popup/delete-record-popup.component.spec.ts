import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRecordPopupComponent } from './delete-record-popup.component';

describe('DeleteRecordPopupComponent', () => {
  let component: DeleteRecordPopupComponent;
  let fixture: ComponentFixture<DeleteRecordPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteRecordPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRecordPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
