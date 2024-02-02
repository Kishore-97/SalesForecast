import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-record-popup',
  templateUrl: './delete-record-popup.component.html',
  styleUrls: ['./delete-record-popup.component.css']
})
export class DeleteRecordPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { record: any },
              private matdialog: MatDialog,
              private dialogRef: MatDialogRef<DeleteRecordPopupComponent>) { }
  
  record = this.data.record

  ngOnInit(): void {
  }

  deleteConfirm(){
    this.dialogRef.close('confirmed')
  }

  cancelDelete(){
    this.matdialog.closeAll()
  }

}
