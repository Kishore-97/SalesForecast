import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule,Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PredictService } from './predict.service';
import { OutputComponent } from './output/output.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AdminComponent,
    OutputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: 'output',
        component: OutputComponent,
      
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path:'admin',
        component: AdminComponent,
        canActivate : [AuthGuard]
      },
      {
        path: '',
        component: HomeComponent
      }
    ])
  ],
  providers: [AuthGuard,AuthService,PredictService,AdminComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
