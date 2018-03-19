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
import { MissionComponent } from './main/mission/mission.component';
import { VehicleComponent } from './main/vehicle/vehicle.component';
import { MissionrouteComponent } from './main/missionroute/missionroute.component';
import { ReportComponent } from './main/report/report.component';
import { HelpComponent } from './main/help/help.component';
import { AboutComponent } from './main/about/about.component';
import { MapComponent } from './map/map.component';
import { MissionProfileComponent } from './main/mission/mission-profile/mission-profile.component';
import { UniversalService } from './services/universal.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    MissionComponent,
    VehicleComponent,
    MissionrouteComponent,
    ReportComponent,
    HelpComponent,
    AboutComponent,
    MapComponent,
    MissionProfileComponent
  ],
  imports: [
    AngularFontAwesomeModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(ROUTES, { useHash: true })
  ],
  providers: [AuthService, UniversalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
