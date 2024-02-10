import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FetchHistoryService {

  constructor(private http: HttpClient) { }

  server_address = environment.API_BASE_URL+"/history"

  getHistory():Observable<any>{

    let headers = new HttpHeaders({
      'Authorization': <string>localStorage.getItem('Authorization')
    })

    return this.http.get(this.server_address,{headers:headers})
    
  }

}


