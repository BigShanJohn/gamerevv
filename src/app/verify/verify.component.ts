import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  settings = {
    length: 4,
    numbersOnly: true,
    timer: 120,
    timerType: 1
  };
  user;
  message;
  constructor(private router: Router, public http: HttpClient, private userService: UserService) {
    this.userService.init();
    this.user = this.userService.getUser();
    if (!this.user) {
      this.navigate('');
    }
  }

  ngOnInit() {
  }

  onInputChange(e) {
    if (e.length == this.settings.length) {
      // e will emit values entered as otp and,
      this.verify(e);
    } else if (e == -1) {
      // if e == -1, timer has stopped
    } else if (e == -2) {
      // e == -2, button click handle
      this.resend();
    }
  }

  navigate(path) {
    this.router.navigateByUrl(path);
  }

  verify(e) {
    this.message = null;
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "id": this.user.id,
      "code": e
    }

    let url = `${Common.API_URL}verify`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response
        if (data.success) {
          this.user = data.data;
          this.userService.setUser(this.user);
          if (this.user.status == Common.ACTIVE) {
            this.router.navigateByUrl('home');
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

  resend() {
    this.message = null;
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "id": this.user.id
    }

    let url = `${Common.API_URL}resend`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response
        if (data.success) {

        }
        else {
          this.message = data.message;
        }
      }, error => {
        this.message = error.error.message;
      });
  }
}
