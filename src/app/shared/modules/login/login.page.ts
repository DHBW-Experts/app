import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Browser } from '@capacitor/browser';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserStateService } from 'src/app/shared/services/user-state/user-state.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit, OnDestroy{
  form: FormGroup;
  email: string;
  password: string;

  authSub: Subscription;

  constructor(
    private router: Router,
    private auth: AuthService,
    private userState: UserStateService
  ) {}

  ngOnInit(): void {
    if(this.userState.auth0User !== null && this.userState.isAuthenticated$.getValue()){
      this.loginSucceeded();
    } else {
      this.authSub = this.userState.isUserInfoAvailable$.subscribe( val => {
        if(val) this.loginSucceeded();
      });
    }
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  loginSucceeded() {
    if(this.userState.user.registered){
      this.router.navigate(["/tabs/profile"]);
    } else {
      this.router.navigate(["/register"]);
    }
  }

  async login() {
    this.auth
      .buildAuthorizeUrl()
      .pipe(mergeMap((url) => Browser.open({ url, windowName: '_self' })))
      .subscribe();
  }
}
