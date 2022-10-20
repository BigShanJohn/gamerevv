import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email: string;
  message: string;
  successMessage: string;
  user: any;
  verify: any;
  isProcessing: boolean = false;
  success: boolean = false;

  constructor(private router: Router, public http: HttpClient, private userService: UserService) {
    this.userService.init();
    this.user = this.userService.getUser();
    if (this.user) {
      this.navigate('home');
    }
  }

  navigate(path) {
    this.router.navigateByUrl(path);
  }

  ngOnInit() {
  }
  
  validateEmail(email) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  }


  submit() {
    this.success = false;
    if (!this.email) {
      return this.message = "Email is required";
    }

    if (!this.validateEmail(this.email)) {
      return this.message = "Email is not valid";
    }


    if (!this.verify) {
      return this.message = "You have to clck on verify button";
    }

    this.message = null;

    this.isProcessing = true;
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "email": this.email
    }

    let url = `${Common.API_URL}forgot-password`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        this.isProcessing = false;
        let data: any = response
        if (data.success) {
          this.successMessage = "An new password has been sent to your email. Thanks"
        }
        else {
          this.message = data.message;
        }
      }, error => {
        this.isProcessing = false;
        this.message = error.error.message;
      });
  }

}
