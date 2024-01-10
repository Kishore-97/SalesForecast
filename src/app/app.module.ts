import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
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
import { DowloadService } from './dowload.service';
import { EDAComponent } from './eda/eda.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RegisterComponent } from './register/register.component'
import { SignupServiceService } from './signup-service.service';
import { HistoryComponent } from './history/history.component';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AdminComponent,
    OutputComponent,
    EDAComponent,
    RegisterComponent,
    HistoryComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgImageSliderModule,
    FlexLayoutModule,
    MatCardModule,
    MatToolbarModule,
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
        path: 'admin',
        component: AdminComponent
        // ,canActivate : [AuthGuard]
      },
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'eda',
        component: EDAComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'history',
        component: HistoryComponent
      }
    ]),
    BrowserAnimationsModule
  ],
  providers: [AuthGuard, AuthService, PredictService, AdminComponent, DowloadService, EDAComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
