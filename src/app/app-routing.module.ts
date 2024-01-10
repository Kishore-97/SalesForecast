import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { OutputComponent } from './output/output.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  // {
  //   path:"/home",
  //   canActivate : []
  // },
  // {
  //   path: "/login"
  // },
  // {
  //   path: "/register"
  // },
  // {
  //   path:"/admin",
  //   canActivate : [AuthGuard]
  // },
  // {
  //   path:"/output",
  //   canActivate : [AuthGuard]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
