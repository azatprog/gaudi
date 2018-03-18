import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { MissionComponent } from './main/mission/mission.component';
import { VehicleComponent } from './main/vehicle/vehicle.component';
import { MissionrouteComponent } from './main/missionroute/missionroute.component';
import { ReportComponent } from './main/report/report.component';
import { HelpComponent } from './main/help/help.component';
import { AboutComponent } from './main/about/about.component';


export const ROUTES: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'app', component: AppComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full'},
            { path: 'login', component: LoginComponent },
            { path: 'main', component: MainComponent,
                children: [
                    { path: '', redirectTo: 'mission', pathMatch: 'full'},
                    { path: 'mission', component: MissionComponent },
                    { path: 'vehicle', component: VehicleComponent },
                    { path: 'route', component: MissionrouteComponent },
                    { path: 'report', component: ReportComponent },
                    { path: 'help', component: HelpComponent },
                    { path: 'about', component: AboutComponent }
                ]
        }
        ]
    },
    { path: '**', component: LoginComponent },
];
