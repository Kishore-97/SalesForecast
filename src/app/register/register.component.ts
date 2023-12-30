import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupServiceService } from '../signup-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router,
    private registerService: SignupServiceService) { }

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl ('', Validators.required)
    })
  }
  onSubmit() {
    this.registerService.send_post(this.registerForm.value.username,
      this.registerForm.value.password, this.registerForm.value.email).subscribe(data => {
        if (data == 'User Successfully registered') {
          window.alert(data + ".... You can now login")
          this.router.navigateByUrl('/login')
        }
        else {
          window.alert("There's already an account with your specified email. Forgot your password?")
          console.log("alt")
        }
      })
    this.registerForm.reset()
  }

} 
