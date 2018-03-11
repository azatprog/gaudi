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
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { ContentComponent } from './main/content/content.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    SidebarComponent,
    ContentComponent,
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
