import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  @ViewChild('f') form: any;
  user: User;

  constructor(  private authService: AuthService,
                private router: Router ) {
                  this.user = new User();
                 }

  ngOnInit() {
  }

  login() {
    if (this.user.login === 'admin' && this.user.password === 'admin') {
      this.authService.isLoggedIn = true;
      this.router.navigate(['/app/main']);
    } else {
      alert('You, HACKER! Get lost.. :)');
    }
    
  }

}
