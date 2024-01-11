import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  email: string = ""
  username: string = ""
  data: any

  server_address = "http://localhost:5000/profile"

  constructor(private http: HttpClient) { }

  getDetails(): Observable<any> {
    let headers = new HttpHeaders({
      'Authorization' : <string>localStorage.getItem('Authorization')
    })
    return this.http.get(this.server_address,{headers:headers})
  }

  updateDetails(username:string, password:string):Observable<any>{
    let headers = new HttpHeaders({
      'Authorization' : <string>localStorage.getItem('Authorization')
    })
    return this.http.post(this.server_address,{'username':username,'password':password},{headers:headers})
  }
}
