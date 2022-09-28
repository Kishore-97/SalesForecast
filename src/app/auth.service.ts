import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInStatus = false

  constructor(private  http: HttpClient) {}
  
  server_address = "http://localhost:5000/"

  setLoggedIn(value: boolean){
    this.loggedInStatus = value
  }
  get isLoggedIn(){
    return this.loggedInStatus
  }

  send_post(username:string,password:string){
    return this.http.post(this.server_address, {username,password})
  }
  
}
