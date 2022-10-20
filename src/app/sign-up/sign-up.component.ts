import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  user: any;
  username: string;
  email: string;
  password: string;
  cPassword: string;
  message: string;
  verify: boolean = false;
  isProcessing: boolean = false;
  success: boolean = false;
  socialType: string;
  socialUser: any;
  constructor(private router: Router, public http: HttpClient, private userService: UserService, private authService: AuthService) {
    this.userService.init();
    this.user = this.userService.getUser();
    if (this.user) {
      this.navigate('home');
    }
  }


  ngOnInit() {
    this.userService.init();
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      if (this.socialUser) {
        this.social();
      }
    });
  }

  social() {
    this.message = null;
    this.success = false;

    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "email": this.socialUser.email,
      "username": this.socialUser.name,
      "id": this.socialUser.id
    }

    let url = `${Common.API_URL}social`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response
        if (data.success) {
          this.user = data.data;
          let dt = new Date();
          dt.setHours(dt.getHours() + 2);
          this.user.expireTime = dt;
          this.userService.setUser(this.user);
          if (this.user.status == Common.ACTIVE) {
            this.router.navigateByUrl('home');
            this.success = true;
            this.message = "Welcome Back";
          }
          else if (this.user.status == Common.PENDING) {
            this.router.navigateByUrl('verify');
          }
          else if (this.user.status == Common.INACTIVE) {
            this.message = 'Account is inactive, please contact support';
          }
          else if (this.user.status == Common.SUSPENDED) {
            this.message = 'Account is suspended, please contact support';
          }
          else if (this.user.status == Common.TERMINATED) {
            this.message = 'Account is terminated, please contact support';
          }
        }
        else {
          this.message = data.message;
        }
      }, error => {
        this.message = error.error.message;
      });
  }

  validateEmail(email) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  }

  submit() {
    this.message = null;
    this.success = false;
    if (!this.username) {
      return this.message = "Username is required";
    }

    if (!this.email) {
      return this.message = "Email is required";
    }

    if (!this.validateEmail(this.email)) {
      return this.message = "Email is not valid";
    }

    if (!this.password) {
      return this.message = "Password is required";
    }

    if (!this.cPassword) {
      return this.message = "Confirm password is required";
    }

    if (this.password != this.cPassword) {
      return this.message = "Password mismatch";
    }

    if (!this.verify) {
      return this.message = "You have to clck on verify button";
    }

    this.isProcessing = true;
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "email": this.email,
      "password": this.password,
      "username": this.username
    }

    let url = `${Common.API_URL}register`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response
        this.isProcessing = false;
        if (data.success) {
          this.user = data.data;
          let dt = new Date();
          dt.setHours(dt.getHours() + 2);
          this.user.expireTime = dt;
          this.userService.setUser(this.user);
          if (this.user.status == Common.ACTIVE) {
            this.router.navigateByUrl('home');
            this.success = true;
            this.message = "Welcome Back";
          }
          else if (this.user.status == Common.PENDING) {
            this.router.navigateByUrl('verify');
          }
          else if (this.user.status == Common.INACTIVE) {
            this.message = 'Account is inactive, please contact support';
          }
          else if (this.user.status == Common.SUSPENDED) {
            this.message = 'Account is suspended, please contact support';
          }
          else if (this.user.status == Common.TERMINATED) {
            this.message = 'Account is terminated, please contact support';
          }


        }
        else {
          this.message = data.message;
        }
      }, error => {
        this.isProcessing = false;
        this.message = error.error.message;
      });
  }

  navigate(path) {
    this.router.navigateByUrl(path);
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.socialType = 'google';
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.socialType = 'facebook';
  }

  signOut(): void {
    this.authService.signOut();
  }

}
