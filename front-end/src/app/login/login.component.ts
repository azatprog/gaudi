import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('f') form: any;

  constructor(  private authService: AuthService,
                private router: Router ) { }

  ngOnInit() {
  }

  login() {
    this.authService.isLoggedIn = true;
    this.router.navigate(['/app/main']);
  }

}
