import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, Event, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $: any;


@Component({
  selector: 'app-category-proposals',
  templateUrl: './category-proposals.component.html',
  styleUrls: ['./category-proposals.component.css']
})
export class CategoryProposalsComponent implements OnInit {

  user: any;
  message: string;
  categories: any;
  proposals: any;
  result: any;
  pageOfItems: Array<any>;
  query: string;
  id: string;
  category: any;
  balance: any;
  transactionFee: any;
  pageLoader: number = 0;

  constructor(private router: Router, public http: HttpClient, private userService: UserService, private route: ActivatedRoute) {
    this.userService.init();
    this.user = this.userService.getUser();
    if (!this.user) {
      this.navigate('');
    }
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");

    this.getCategory();
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

  getCategory() {
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "id": this.id
    }

    let url = `${Common.API_URL}category-one`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response;
        this.pageLoader++;
        this.category = data.category
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
          var id = this.id;
          this.proposals = this.proposals.filter(function (el) {
            let dateOptions: any = {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            };
            let now = new Date().toLocaleDateString('en-US', dateOptions);
            return el.categoryId == id && Date.parse(el.endDate) >= Date.parse(now); 
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
