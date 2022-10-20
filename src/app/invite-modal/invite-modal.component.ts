import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';
declare var $: any;

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.css']
})
export class InviteModalComponent implements OnInit {
  @Input() invite: any;
  user: any;
  email: string;
  message: string;

  constructor(private router: Router, public http: HttpClient, private userService: UserService) {
    this.userService.init();
    this.user = this.userService.getUser();

  }

  ngOnInit() {
  }

  validateEmail(email) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  }

  submit() {
    this.message = null;
    if (!this.email) {
      return this.message = "Email is required";
    }

    if (!this.validateEmail(this.email)) {
      return this.message = "Email is not valid";
    }

    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "email": this.email,
      "id": this.user.id
    }

    let url = `${Common.API_URL}invite`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response
        if (data.success) {
          this.invite = true;
        }
        else {
          this.message = data.message;
        }
      }, error => {
        this.message = error.error.message;
      });
  }
}
