import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { PredictService } from '../predict.service';
import { NavigationExtras, Router } from '@angular/router';
import { DebugService } from '../debug.service';
import { SessionService } from '../session.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutPopupComponent } from '../logout-popup/logout-popup.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css','../output/pure.css']
})
export class AdminComponent implements OnInit {

  dataset: [][] = [];
  headers: [] = [];
  target_var = ''
  range: Number = 0
  periodicity_options = ['Days', 'Weeks', 'Months','Years']
  periodicity = ''
  date_var= ''
  sheet:any
  filename = ''
  isSessionValid=false
  username = localStorage.getItem('username')
  constructor(private pred:PredictService,
              private router:Router,
              private debug : DebugService,
              private session:SessionService,
              private matdialog: MatDialog) { }
  

  ngOnInit(): void {

    // //console.log("-------from admin component : ",localStorage.getItem('Authorization')) 
    // this.debug.sendpost().subscribe((data)=>{
    //   //console.log(data)
    //   // if(data['message']!='token valid'){
    //   //   this.session.setSessionValidity(false)
    //   // }
    // })
    this.session.checkSessionValid().subscribe((data)=>{
      //console.log(data)
      this.isSessionValid = data
    })
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target)
    if (target.files.length !== 1) {
      window.alert("Only one file can be uploaded")
      throw new Error("Cannot use more than 1 file")
    }

    this.filename = target.files[0].name
    const reader: FileReader = new FileReader()
    

    reader.onload = (e: any) => {
      const bstr: string = e.target.result
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' })
      const wsname: string = wb.SheetNames[0]
      const ws: XLSX.WorkSheet = wb.Sheets[wsname]
      //console.log(ws)
      this.sheet = ws
      //console.log("sheet:",this.sheet)
      
      //parsed to json only to get the headers. worksheet is the actual data used
      this.dataset = (XLSX.utils.sheet_to_json(ws, { header: 1 }))
      //console.log(this.dataset)
      this.headers = this.dataset[0]
      //console.log(this.headers)
    }

    reader.readAsBinaryString(target.files[0])
  }

  targetSubmit(t: any) {
    this.target_var = t.target.querySelector('#targetvar').value
    this.periodicity = t.target.querySelector('#periodicity').value
    this.range = t.target.querySelector('#range').value
    this.date_var = t.target.querySelector('#datevar').value
    this.pred.populate(this.sheet,this.target_var,this.date_var, this.periodicity, this.range, this.filename)
    const navExtras : NavigationExtras ={
      queryParams: {
        fetchDataFromPredict: true
      }
    }
    this.router.navigate(['/output'],navExtras) 
  }

  openLogout(){
    //console.log('clicked')
    this.matdialog.open(LogoutPopupComponent)
  }
} 
