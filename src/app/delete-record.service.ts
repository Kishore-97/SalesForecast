import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DeleteRecordService {

  constructor(private http:HttpClient) { }
  server_address = "http://localhost:5000/deleteRecord"

  deleteRecord(datetime:string):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization':<string>localStorage.getItem('Authorization')
    })
    return this.http.post(this.server_address,{'date and time':datetime},{headers:headers})
  }
}
