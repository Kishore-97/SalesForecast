import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx'
@Injectable({
  providedIn: 'root'
})
export class PredictService {
  dataset: [][] = [];
  constructor(private http:HttpClient) { }

  server_address = "http://localhost:5000/predict"

  populate(ws:any){
    this.dataset = (XLSX.utils.sheet_to_json(ws, { header: 1 }))
  }

  send_post(message:any){
    return this.http.post(this.server_address,[message])
  }
}
