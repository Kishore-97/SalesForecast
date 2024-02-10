import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DeleteRecordService {

  constructor(private http:HttpClient) { }
  server_address = environment.API_BASE_URL+"/deleteRecord"

  deleteRecord(datetime:string):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization':<string>localStorage.getItem('Authorization')
    })
    return this.http.post(this.server_address,{'date and time':datetime},{headers:headers})
  }
}
