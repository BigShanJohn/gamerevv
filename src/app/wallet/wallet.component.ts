import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';
import * as moment from 'moment';
declare var $: any;
@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  user: any;
  message: string;
  balance: any;
  histories: any;
  history: any;
  transactionFee: any;
  pageOfItems: Array<any>;
  pageLoader: number = 0;
  isCopied: boolean = false;

  constructor(private router: Router, public http: HttpClient, private userService: UserService) {
    this.userService.init();
    this.user = this.userService.getUser();
    if (!this.user) {
      this.navigate('');
    }
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }


  getSymbol(address) {
    if (address == Common.GAM) {
      return 'GAM';
    }
    if (address == Common.GAV) {
      return 'GAV';
    }
    if (address == Common.BNB) {
      return 'WBNB';
    }
    return 'WBNB'
  }

  loadExternalJs() {
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
  loadHistory(history) {

    this.history = history;
    $("#openHistoryModal").click();
  }

  openWithdrawModal() {
    $("#openWithdrawModal").click();
  }

  openDepositModal() {
    $("#openDepositModal").click();
  }

  formatMoney(number) {
    number = parseFloat(number);
    return String(number.toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  ngAfterViewInit() {

    this.loadExternalJs();
  }
  ngOnInit() {
    this.getBalance();
    this.getHistories();
    this.getTransactionFee();

  }

  reloadData(data) {
    if (data) {
      this.getBalance();
    }
  }
  navigate(path) {
    this.router.navigateByUrl(path);
  }
  get total() {
    return parseFloat(this.balance.price_USD) ? (parseFloat(this.balance.price_USD) * parseFloat(this.balance.GAV)) + (parseFloat(this.balance.price_USD) * parseFloat(this.balance.GAM) / 1000) + ((parseFloat(this.balance.price_USD) / parseFloat(this.balance.price_BNB)) * parseFloat(this.balance.BNB)) : 0;
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


  get GAMValue() {
    return this.balance.price_USD * this.balance.GAM / 1000;
  }
  get BNBValue() {
    return (this.balance.price_USD / this.balance.price_BNB) * this.balance.BNB;
  }
  get GAVValue() { return this.balance.price_USD * this.balance.GAV; }
  get GAMPercentage() {
    return (this.GAMValue / this.total) * 100;
  }
  get GAVPercentage() { return (this.GAVValue / this.total) * 100; }
  get BNBPercentage() { return (this.BNBValue / this.total) * 100; }

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
  getHistories() {
    this.message = null;
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "address": this.user.address,
      "limit": 100,
      "offset": 0
    }

    let url = `${Common.API_URL}transaction-histories`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response;
        this.pageLoader++;
        this.histories = data.result;

      }, error => {
        this.pageLoader++;
        this.message = error.error.message;
      });
  }


  formatDate(date) {
    return moment(date).format('YYYY MMM DD h:mm');
  }

  bscAddressLink(address) {
    return Common.NETWORK_URL + "address/" + address;
  }

  bscTransactionLink(address) {
    return Common.NETWORK_URL + "tx/" + address;
  }

  getLogo(symbol) {
    return 'assets/img/' + symbol + '.png';
  }

  isFrom(address1, address2) {
    return address1.toLowerCase().trim() === address2.toLowerCase().trim();
  }



  getNotificationTitle(from, to, token) {
    if (this.isFrom(from, this.user.address)) {

      if (to == Common.CREATOR) {
        if (token == 'GAV') {
          return 'Swapped GAV to GAM';
        }
        else if (token == 'GAM') {
          return 'Swapped GAM to GAV';
        }
      }
      else if (to == Common.PANCAKE) {
        if (token == 'BNB') {
          return 'Swapped BNB to GAV';
        }
        else if (token == 'GAV') {
          return 'Swapped BNB to GAV';
        }
      }
      else {
        return 'Withdrew ' + token
      }
    }
    return 'Deposited ' + token;
  }

  getNotificationIcon(from, to, token) {
    let title = ""
    if (this.isFrom(from, this.user.address)) {
      if (to == Common.CREATOR) {
        if (token == 'GAV') {
          return 'SWAP';
        }
        else if (token == 'GAM') {
          return 'SWAP';
        }
      }
      else if (to == Common.PANCAKE) {
        if (token == 'BNB') {
          return 'SWAP';
        }
        else if (token == 'GAV') {
          return 'SWAP';
        }
      }
      else {
        return 'OUT'
      }
    }
    return 'IN';
  }
}
