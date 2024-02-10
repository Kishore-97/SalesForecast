import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DebugService {

  constructor(private http : HttpClient) { }

  server_address = environment.API_BASE_URL+"/decode"

  sendpost():Observable<any>{
    //console.log("-------from debug service local storage : ",localStorage.getItem('Authorization'))
    const headers = new HttpHeaders({
      // 'invalid_token':"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imxrazk3MDFAZ21haWwuY29tIiwiZXhwIjoxNzA0NDYzNjU3fQ.5BEhOeY81-krOlrwav-LVYLwHnPKL5ELPUOTFAh-8LU",
      'Authorization' : <string>localStorage.getItem('Authorization')
    })
    //console.log("-------from debug service http headers : ",headers.get('Authorization'))
    return this.http.post(this.server_address,{},{headers:headers})
  }
}
