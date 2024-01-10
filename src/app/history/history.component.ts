import { Component, OnInit } from '@angular/core';
import { FetchHistoryService } from '../fetch-history.service';
import { FetchRecordService } from '../fetch-record.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  constructor(private history: FetchHistoryService, private record: FetchRecordService, private router: Router) { }

  tabledata : any

  ngOnInit(): void {
    this.history.getHistory().subscribe((data)=>{
      if(data['message'] == 'token present'){
        this.tabledata= data['records']
      }
      else{
        console.log(data)
        // Handle token expiration etc.
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

}
