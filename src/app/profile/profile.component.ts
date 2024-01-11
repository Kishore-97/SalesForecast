import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../user-profile.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private profile: UserProfileService) { }

  profileForm!: FormGroup;
  // email = ''
  // username = ''

  ngOnInit(): void {

    this.profileForm = new FormGroup({
      'email': new FormControl({value:'',disabled:true}),
      'username': new FormControl('',[Validators.required, Validators.pattern('^[a-zA-Z0-9_-]{3,16}$')]),
      'password': new FormControl('',Validators.required),
      'confirm_password': new FormControl('')
    }
    ,{validators: this.passwordsMatch}
    )

    this.profile.getDetails().subscribe((data) => {
      if (data['message'] == 'token present') {
        console.log(data)
        this.profileForm.setValue({
        'email':data['profile']['email'],
        'username':data['profile']['username'],
        'password':data['profile']['password'],
        'confirm_password':data['profile']['password']
      })
      }
      else {
        console.log(data['message'])
        // Handle token expiration etc.
      }
    })
  }

  submitUpdate() {
    this.profile.updateDetails(this.profileForm.value.username, this.profileForm.value.password).subscribe((data) => {
      if (data['message'] == 'profile updated successfully') {
        window.alert(data['message'])
        location.reload()
      }
      else {
        console.log(data)
        // Handle token expiration etc.
      }
    })
  }

  passwordsMatch(form: AbstractControl) {
    return (form.get('password')?.value === form.get('confirm_password')?.value) ? null : {mismatch: true}
  }


}
