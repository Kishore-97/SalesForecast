import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OutputComponent } from './output/output.component';
import { EDAComponent } from './eda/eda.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RegisterComponent } from './register/register.component'
import { HistoryComponent } from './history/history.component';
import { SidenavComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import {MatDialogModule} from '@angular/material/dialog';
import { LogoutPopupComponent } from './logout-popup/logout-popup.component';
import {MatIconModule} from'@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BodyComponent } from './body/body.component';


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
    SidenavComponent,
    ProfileComponent,
    LogoutPopupComponent,
    BodyComponent
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
    MatDialogModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    MatButtonModule,
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
      },
      {
        path:'profile',
        component: ProfileComponent
      }
    ]),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
