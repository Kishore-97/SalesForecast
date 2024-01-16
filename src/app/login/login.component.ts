import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,
    private authser: AuthService,
    private session : SessionService) { }

  loginForm!: FormGroup;
  sessionExists!:boolean

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
    // this.session.checkSessionValid().subscribe((data)=>{
    //   console.log("from login: ",data)
    // })
    this.session.checkSessionValid().subscribe((data)=>{
      this.sessionExists = data
    })
  }
  onSubmit() {
    this.authser.send_post(this.loginForm.value.email,
      this.loginForm.value.password).subscribe(data => {
        if (data['message'] == 'authenticated') {
          
          console.log('----from login data: ',data['Authorization'])
          
          localStorage.setItem('Authorization',data['Authorization'])
          
          console.log('----from login localstorage: ',localStorage.getItem('Authorization'))
          
          this.session.setSessionValidity(true)
          this.router.navigateByUrl('/admin')
          this.authser.setLoggedIn(true)
        }
        else {
          window.alert(data)
          console.log("alt")
        }
      })
    this.loginForm.reset()
  }

}
