import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-popup',
  templateUrl: './logout-popup.component.html',
  styleUrls: ['./logout-popup.component.css']
})
export class LogoutPopupComponent implements OnInit {

  constructor(private session: SessionService,
    private router: Router,
    private matdialog: MatDialog) { }

  ngOnInit(): void {
  }

  logoutConfirm(){
    this.session.setSessionValidity(false)
    localStorage.removeItem('Authorization')
    this.matdialog.closeAll()
    this.router.navigateByUrl('/login')
  }

  cancelLogout(){
    this.matdialog.closeAll()
  }
}
