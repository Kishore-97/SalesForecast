import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignupServiceService {

  constructor(private http: HttpClient) { }

  server_address = environment.API_BASE_URL+"/signup"

  send_post(username: string, password: string, email:string) {
    return this.http.post(this.server_address, {username, password, email})
  }
}
