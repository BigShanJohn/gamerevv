import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css']
})
export class ProposalsComponent implements OnInit {
  user: any;
  message: string;
  categories: any;
  proposals: any;
  result: any;
  pageOfItems: Array<any>;
  query: string;
  balance: any;
  transactionFee: any;
  pageLoader: number = 0;

  constructor(private router: Router, public http: HttpClient, private userService: UserService) {
    this.userService.init();
    this.user = this.userService.getUser();
    if (!this.user) {
      this.navigate('');
    }
  }

  ngOnInit() {
    this.getCategories();
    this.getProposals();
    this.getBalance();
    this.getTransactionFee();
    try {
      var link = $('.js-popup-open');
      link.magnificPopup({
        type: 'inline',
        fixedContentPos: true,
        removalDelay: 200,
        callbacks: {
          beforeOpen: function beforeOpen() {
            this.st.mainClass = this.st.el.attr('data-effect');
          }
        }
      });
    }
    catch (ex) { }
  }

  getImageURL(image) {
    return Common.API_URL + image;
  }
  search() {
    var query = this.query;
    if (query.trim().length > 2) {
      this.result = this.proposals.filter(function (el) {
        return el.title.toLowerCase().includes(query) || el.description.toLowerCase().includes(query);
      });
    }
    else {
      this.result = this.proposals;
    }
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  getCategories() {
    this.message = null;

    let url = `${Common.API_URL}category-all`;
    this.http.get(url)
      .subscribe(response => {
        let data: any = response;
        this.pageLoader++;
        if (data.success) {
          this.categories = data.categories;
          setTimeout(() => {
            var slider = $('.js-slider');
            slider.owlCarousel({
              items: 1,
              nav: false,
              dots: true,
              loop: true,
              smartSpeed: 700
            });
            var sliderCategories = $('.js-slider-categories');
            sliderCategories.owlCarousel({
              items: 1,
              nav: false,
              dots: false,
              loop: false,
              smartSpeed: 0,
              responsive: {
                0: {
                  items: 1,
                  autoHeight: true
                },
                768: {
                  items: 3
                },
                1024: {
                  items: 4
                },
                1340: {
                  items: 5
                }
              }
            });
          }, 1000);

        }
        else {
          this.message = data.message;
        }
      }, error => {
        this.message = error.error.message;
      });
  }
  reloadData(data) {
    if (data) {
      this.getProposals();
    }
  }
  getProposals() {
    this.message = null;

    let url = `${Common.API_URL}proposal-all`;
    this.http.get(url)
      .subscribe(response => {
        let data: any = response;
        this.pageLoader++;
        if (data.success) {
          this.proposals = _(JSON.parse(data.proposals))
            .orderBy('dateCreated', 'desc')
            .value();

          this.proposals = this.proposals.filter(function (el) {
            let dateOptions: any = {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            };
            let now = new Date().toLocaleDateString('en-US', dateOptions);

            return Date.parse(el.endDate) >= Date.parse(now);
          });

          this.result = this.proposals;
        }
        else {
          this.message = data.message;
        }
      }, error => {
        this.message = error.error.message;
      });
  }

  navigate(path) {
    this.router.navigateByUrl(path);
  }

  getBalance() {
    this.message = null;


    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "address": this.user.address
    }

    let url = `${Common.API_URL}balance`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response;
        this.pageLoader++;
        if (data.success) {
          this.balance = data.data;
        }
        else {
          this.message = data.message;
        }
      }, error => {
        this.message = error.error.message;
      });
  }

  getTransactionFee() {
    this.message = null;


    let url = `${Common.API_URL}transaction-fee`;
    this.http.get(url,)
      .subscribe(response => {
        let data: any = response;
        this.pageLoader++;
        this.transactionFee = data.fees;
      }, error => {
        this.message = error.error.message;
      });
  }
}
