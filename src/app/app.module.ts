import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, { useHash: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
