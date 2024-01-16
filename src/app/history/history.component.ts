import { Component, OnInit } from '@angular/core';
import { FetchHistoryService } from '../fetch-history.service';
import { FetchRecordService } from '../fetch-record.service';
import { NavigationExtras, Router } from '@angular/router';
import { SessionService } from '../session.service';
import { LogoutPopupComponent } from '../logout-popup/logout-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  constructor(private history: FetchHistoryService,
     private record: FetchRecordService,
     private router: Router,
     private session : SessionService,
     private matdialog: MatDialog) { }

  tabledata : any
  isSessionValid = this.session.checkSessionValid()

  ngOnInit(): void {
    this.history.getHistory().subscribe((data)=>{
      if(data['message'] == 'token present'){
        this.tabledata= data['records']
      }
      else{
        console.log(data)
        this.session.setSessionValidity(false)
        localStorage.removeItem('Authorization')
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

  openLogout(e:any){
    console.log('clicked')
    this.matdialog.open(LogoutPopupComponent)
  }

}
