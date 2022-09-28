import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router:Router){}

  loginForm!: FormGroup;
  loginValid: boolean = false;

  username_list = ['Ned','Robb','Arya','Jon']
  password_list = ['honor','wolf','needle','ghost']

  n = 0;


  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username : new FormControl(),
      password : new FormControl()
    }) 
  }
  onSubmit(){
    for(let i = 0; i < this.username_list.length;i++) {
      if(this.loginForm.value.username == this.username_list[i]){
        if(this.loginForm.value.password == this.password_list[i]){
          this.loginValid = true
          this.router.navigate(['/admin'])
          // this.loginValid = false
          console.log(this.loginValid)
          return this.loginValid
        }
        else{
          window.alert("incorrect password")
          this.router.navigateByUrl('/login')
          return this.loginValid
        }
      }
      this.n=this.n+1
    }
    if(this.n>=this.username_list.length){
      window.alert("user not found")
      this.router.navigateByUrl('/')
      this.n=0
      return this.loginValid
    }
    this.loginForm.reset()
    return this.loginValid
  }
  
}
