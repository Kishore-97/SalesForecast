import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class SignupServiceService {

  constructor(private http: HttpClient) { }

  server_address = "http://localhost:5000/signup"

  send_post(username: string, password: string, email:string) {
    return this.http.post(this.server_address, {username, password, email})
  }
}
