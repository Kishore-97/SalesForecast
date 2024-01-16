import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  private isSessionValid = new BehaviorSubject<boolean>(!!localStorage.getItem('Authorization'))

  checkSessionValid():Observable<boolean>{
    console.log("behaviour subject value on check:",this.isSessionValid.value)
    return this.isSessionValid.asObservable()
  }

  setSessionValidity(status:boolean){
    this.isSessionValid.next(status)
    console.log("behaviour subject has been set to:", this.isSessionValid.value)
  }
}
