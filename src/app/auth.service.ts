import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInStatus = false

  constructor(private  http: HttpClient) {}
  
  server_address = environment.API_BASE_URL+"/login"

  setLoggedIn(value: boolean){
    this.loggedInStatus = value 
  }
  get isLoggedIn(){
    return this.loggedInStatus
  }

  send_post(email:string,password:string):Observable<any>{
    return this.http.post(this.server_address,{email,password})
  }
  
}
