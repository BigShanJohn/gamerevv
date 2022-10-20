import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';
declare var $: any;
@Component({
  selector: 'app-withdraw-modal',
  templateUrl: './withdraw-modal.component.html',
  styleUrls: ['./withdraw-modal.component.css']
})
export class WithdrawModalComponent implements OnInit {
  @Input() balance: any;
  @Input() fee: any;
  @Output() newEvent = new EventEmitter<string>();
  user: any;
  message: string;
  address: string;
  amount: string;
  amountError: string;
  addressError: string;
  withdrawId: string;
  processing: boolean = false;
  success: boolean = false;
  isConfirm: boolean = false
  settings = {
    length: 4,
    numbersOnly: true,
    timer: 120,
    timerType: 1
  };

  constructor(private router: Router, public http: HttpClient, private userService: UserService) {
    this.userService.init();
    this.user = this.userService.getUser();

  }

  formatMoney(number) {
    number = parseFloat(number);
    return String(number.toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  maxAmount() {
    this.amount = parseFloat(this.balance.GAV).toFixed(2);
  }
  ngOnInit() {
    $('.js-field-input').focusin(function () {
      $(this).parents('.js-field').addClass('active');
    });
    $('.js-field-input').focusout(function () {
      var _this = $(this),
        field = _this.parents('.js-field'),
        value = _this.val();
      if (value == '') {
        field.removeClass('active');
      }
    });
  }

  amountValidator() {
    this.amountError = null;
    if (!this.amount) {
      return this.amountError = "Amount is required";
    }

    if (isNaN(parseFloat(this.amount))) {
      return this.amountError = "Invalid Amount";
    }

    if (parseFloat(this.balance.GAV) < parseFloat(this.amount)) {
      return this.amountError = "Insufficient Fund";
    }
  }

  addressValidator() {
    this.addressError = null;
    if (!this.address) {
      return this.addressError = "Address is required";
    }
  }

  submit() {
    this.message = null;
    this.amount = this.amount ? this.amount.replace(/,/g, '') : null;
    this.amountError = null;
    this.addressError = null;
    if (!this.amount) {
      this.amountError = "Amount is required";
      return this.message = "Amount is required";
    }

    if (isNaN(parseFloat(this.amount))) {
      this.amountError = "Invalid Amount";
      return this.message = "Invalid Amount";
    }
    if (parseFloat(this.balance.GAV) < parseFloat(this.amount)) {
      this.amountError = "Insufficient Fund";
      return this.message = "Insufficient Fund";
    }

    if (parseFloat(this.fee) * 5 > parseFloat(this.amount)) {
      this.amountError = "Amount is low";
      return this.message = "Amount is low";
    }
    if (!this.address) {
      this.addressError = "Address is required";
      return this.message = "Address is required";
    }

    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "address": this.address,
      "amount": this.amount,
      "id": this.user.id
    }

    let url = `${Common.API_URL}pre-withdraw`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        console.log(response);
        let data: any = response
        if (data.success) {
          this.withdrawId = data.id;
        }
        else {
          this.message = data.message;
        }
      }, error => {
        console.log(error);
        this.message = error.error.message;
      });
  }

  get receivable() {
    return parseFloat(this.amount.replace(/,/g, '')) - parseFloat(this.fee);
  }

  onInputChange(e) {
    console.log(e);
    if (e.length == this.settings.length) {
      // e will emit values entered as otp and,
      this.withdraw(e);
      console.log('otp is', e);
    } else if (e == -1) {
      // if e == -1, timer has stopped
      console.log(e, 'resend button enables');
    } else if (e == -2) {
      // e == -2, button click handle
      this.resend();
      console.log('resend otp');
    }
  }

  navigate(path) {
    this.router.navigateByUrl(path);
  }

  withdraw(e) {
    this.processing = true;
    this.success = false;
    this.message = null;
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "id": this.withdrawId,
      "code": e
    }

    let url = `${Common.API_URL}withdraw`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        console.log(response);
        let data: any = response
        if (data.success) {
          this.withdrawId = null;
          this.success = true;
          this.message = "Your transaction has been successfully confirmed.";
          this.userService.setFlash("Your transaction has been successfully confirmed.");
          $(".mfp-close").click();
          this.newEvent.emit(data.data);

        }
        else {
          this.message = data.message;
        }
        this.processing = false;
      }, error => {
        console.log(error);
        this.processing = false;
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
      "id": this.withdrawId
    }

    let url = `${Common.API_URL}withdraw-resend`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        console.log(response);
        let data: any = response
        if (data.success) {

        }
        else {
          this.message = data.message;
        }
      }, error => {
        console.log(error);
        this.message = error.error.message;
      });
  }

  openConfirm() {
    this.isConfirm = true;
  }

  onConfirm(data) {
    console.log(data);
    this.isConfirm = false;
    if (data == 'yes') {
      this.submit();
    }
  }
}
