import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import * as XLSX from 'xlsx'
@Injectable({
  providedIn: 'root'
})
export class PredictService {
  dataset: any
  target_var = ''
  range: Number = 0
  periodicity = ''
  date_var = ''
  filename = ''

  dataArray = []

  constructor(private http: HttpClient) { }

  server_address = "http://localhost:5000/forecast"

  populate(ws: any, target: any, date: string, periodicity: string, range: Number, filename:string) {
    this.dataset = (XLSX.utils.sheet_to_csv(ws))
    this.target_var = target
    this.date_var = date
    this.range = range
    this.periodicity = periodicity
    this.filename = filename
    console.log(this.dataset, this.target_var, this.date_var, this.periodicity, this.range)
  }

  send_post(): Observable<any> {
    if (!this.dataset) {
      return new Observable<any>(observer => {
        observer.next('no data');
        observer.complete();
      });
    } 
    else {
      let headers = new HttpHeaders({
        // 'invalid_token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imxrazk3MDFAZ21haWwuY29tIiwiZXhwIjoxNzA0NDYzNjU3fQ.5BEhOeY81-krOlrwav-LVYLwHnPKL5ELPUOTFAh-8LU",
        'Authorization': <string>localStorage.getItem('Authorization')
      });

      console.log("--------from pred service headers:", headers.get('Authorization'));
      
      let parameters = { 
        'df': this.dataset, 
        'target': this.target_var,  
        'date': this.date_var, 
        'periodicity': this.periodicity, 
        'range': this.range ,
        'filename': this.filename
      }

      return this.http.post(this.server_address, parameters, { headers: headers })

    }
  }
}
