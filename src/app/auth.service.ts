import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInStatus = false

  constructor(private  http: HttpClient) {}
  
  server_address = "http://localhost:5000/login"

  setLoggedIn(value: boolean){
    this.loggedInStatus = value 
  }
  get isLoggedIn(){
    return this.loggedInStatus
  }

  send_post(email:string,password:string){
    return this.http.post(this.server_address,{email,password})
  }
  
}
