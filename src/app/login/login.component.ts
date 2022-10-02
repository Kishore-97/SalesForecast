import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,
    private authser: AuthService) { }

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }
  onSubmit() {
    this.authser.send_post(this.loginForm.value.username,
      this.loginForm.value.password).subscribe(data => {
        if (data == 'authenticated') {
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
