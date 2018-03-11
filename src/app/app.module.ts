import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from './app.routes';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { MainComponent } from './main/main.component';
import { BusroutesComponent } from './main/busroutes/busroutes.component';
import { TripsComponent } from './main/trips/trips.component';
import { DriversComponent } from './main/drivers/drivers.component';
import { BusesComponent } from './main/buses/buses.component';
import { ReportsComponent } from './main/reports/reports.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    BusroutesComponent,
    TripsComponent,
    DriversComponent,
    BusesComponent,
    ReportsComponent
  ],
  imports: [
    AngularFontAwesomeModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(ROUTES, { useHash: true })
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
