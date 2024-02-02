import { Component, OnInit } from '@angular/core';
import { FetchHistoryService } from '../fetch-history.service';
import { FetchRecordService } from '../fetch-record.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SessionService } from '../session.service';
import { LogoutPopupComponent } from '../logout-popup/logout-popup.component';
import { DeleteRecordPopupComponent } from '../delete-record-popup/delete-record-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteRecordService } from '../delete-record.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  constructor(private history: FetchHistoryService,
     private record: FetchRecordService,
     private delete_record: DeleteRecordService,
     private router: Router,
     private session : SessionService,
     private activeroute: ActivatedRoute,
     private matdialog: MatDialog) { }

  tabledata : any
  isSessionValid = this.session.checkSessionValid()
  username = localStorage.getItem('username')

  ngOnInit(): void {
    this.history.getHistory().subscribe((data)=>{
      if(data['message'] == 'token present'){
        this.tabledata= data['records']
      }
      else{
        console.log(data)
        this.session.setSessionValidity(false)
        localStorage.removeItem('Authorization')
        localStorage.removeItem('username')
      }
    })
  }

  viewRecord(datetime:string){
    this.record.populate(datetime)
    
    const navExtras : NavigationExtras ={
      queryParams: {
        fetchDataFromPredict: false
      }
    }
    this.router.navigateByUrl('/output',navExtras)
  }
  deleteRecord(record:any){
    const deletePopupRef = this.matdialog.open(DeleteRecordPopupComponent,{data:{record:record}})
    deletePopupRef.afterClosed().subscribe((result)=>{
      if (result == 'confirmed'){
        this.delete_record.deleteRecord(record['date and time']).subscribe((data)=>{
          if (data['message'] == 'deletion successful'){
            window.alert("Record deleted successfully")
            this.router.navigate(['.'], { relativeTo: this.activeroute })
          }
          else{
            window.alert("There was a problem with deleting the record: "+data['message'])
          }
        })
      }
    })
  }

  openLogout(e:any){
    console.log('clicked')
    this.matdialog.open(LogoutPopupComponent)
  }

}
