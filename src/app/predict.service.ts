import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx'
@Injectable({
  providedIn: 'root'
})
export class PredictService {
  dataset :any
  target_var = ''
  range: Number = 0
  periodicity = ''
  date_var=''

  dataArray = []


  constructor(private http:HttpClient) { }

  server_address = "http://localhost:5000/predict"

  populate(ws:any,target:any,date:any,periodicity:any,range:any){
    this.dataset = (XLSX.utils.sheet_to_csv(ws))
    this.target_var = target
    this.date_var=date
    this.range = range
    this.periodicity = periodicity
    console.log(this.dataset,this.target_var,this.date_var,this.periodicity, this.range)
  }

  send_post(df:any,target:any,date:any,periodicity:any,range:any):Observable<any>{
    return this.http.post(this.server_address,[df,target,date,periodicity,range])
  }
}
