import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { BusroutesComponent } from './main/busroutes/busroutes.component';
import { TripsComponent } from './main/trips/trips.component';
import { DriversComponent } from './main/drivers/drivers.component';
import { BusesComponent } from './main/buses/buses.component';
import { ReportsComponent } from './main/reports/reports.component';


export const ROUTES: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'app', component: AppComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full'},
            { path: 'login', component: LoginComponent },
            { path: 'main', component: MainComponent,
                children: [
                    { path: '', redirectTo: 'routes', pathMatch: 'full'},
                    { path: 'routes', component: BusroutesComponent },
                    { path: 'trips', component: TripsComponent },
                    { path: 'drivers', component: DriversComponent },
                    { path: 'buses', component: BusesComponent },
                    { path: 'reports', component: ReportsComponent }
                ]
        }
        ]
    },
    { path: '**', component: LoginComponent },
];
