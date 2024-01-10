import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { get } from 'http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  email: string = ""
  username: string = ""
  data: any

  server_address = "http://localhost:5000/get_user"

  constructor(private http: HttpClient) { }


  updateDetails(username?: string, email?: string) {
    if (username && email) {
      this.username = username
      this.email = email
    }
    else if (username) {
      this.username = username
    }
    else if (email) {
      this.email = email
    }

  }

  getDetails(email: string) {
    this.http.post(this.server_address, { email }).subscribe((data) => {
      this.data = data
      this.email = email
      this.username = this.data[0]
    }, error => { window.alert(error) })
  }
}
