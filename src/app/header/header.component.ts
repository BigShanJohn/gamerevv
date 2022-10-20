import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: any;
  message: any;
  histories: any;
  oldCount: number = 0;

  constructor(private router: Router, private userService: UserService, public http: HttpClient) {
    this.userService.init();
    this.user = this.userService.getUser();
  }

  ngOnInit() {
    this.loadHeaderExternalJs();
    this.getHistories();
    setInterval(() => this.getHistories(), 5000);
  }

  getPhoto(id) {
    if (!id) {
      id = 1;
    }
   
    return Common.IPFS +`revvcitizens%20%28${id}%29.png`;
  }

  openNotification() {
    this.oldCount = this.histories.length;
  }
  formatDate(date) {
    return moment(date).fromNow();
  }

  getHistories() {
    this.message = null;


    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "id": this.user.id
    }

    let url = `${Common.API_URL}history`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response
        if (data.success) {
          this.histories = _(data.histories)
            .orderBy('dateCreated', 'desc')
            .value();
          if (this.oldCount == 0) {
            this.oldCount = this.histories.length;
          }

        }
        else {
          this.message = data.message;
        }
      }, error => {
        this.message = error.error.message;
      });
  }
  logout() {
    this.userService.setUser(null);
    this.navigate('');
  }
  loadHeaderExternalJs() {
    var header = $('.header'),
      items = header.find('.header__item');

    items.each(function () {
      var item = $(this),
        head = item.find('.header__head'),
        body = item.find('.header__body');

      head.on('click', function (e) {
        e.stopPropagation();

        if (!item.hasClass('active')) {
          items.removeClass('active');
          item.addClass('active');
        } else {
          items.removeClass('active');
        }
      });

      body.on('click', function (e) {
        e.stopPropagation();
      });

      $('body').on('click', function () {
        items.removeClass('active');
      });
    });

  }

  navigate(path) {
    this.router.navigateByUrl(path);
  }
}
