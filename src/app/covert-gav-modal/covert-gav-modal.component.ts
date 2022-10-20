import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';
declare var $: any;


@Component({
  selector: 'app-covert-gav-modal',
  templateUrl: './covert-gav-modal.component.html',
  styleUrls: ['./covert-gav-modal.component.css']
})
export class CovertGavModalComponent implements OnInit {
  @Input() balance: any;
  @Input() fee: any;
  @Output() newEvent = new EventEmitter<string>();
  user: any;
  message: string;
  amount: string;
  processing: boolean = false;
  success: boolean = false;
  amountError: string;
  isConfirm: boolean = false

  constructor(private router: Router, public http: HttpClient, private userService: UserService) {
    this.userService.init();
    this.user = this.userService.getUser();

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

    if (parseFloat(this.balance.GAM) < parseFloat(this.amount)) {
      return this.amountError = "Insufficient Fund";
    }


    if (parseFloat(this.amount) < 4000) {
      return this.amountError = "The minimum amount of GAM you can swap is 4,000";
    }
  }

  submit() {

    this.message = null;
    this.amountError = null;
    this.amount = this.amount ? this.amount.replace(/,/g, '') : null;
    this.success = false;
    if (!this.amount) {
      return this.message = "Amount is required";
    }

    if (isNaN(parseFloat(this.amount))) {
      return this.message = "Invalid Amount";
    }

    if (parseFloat(this.balance.GAM) < parseFloat(this.amount)) {
      return this.message = "Insufficient Fund";
    }


    if (parseFloat(this.amount) < 4000) {
      return this.message = "Amount is too low";
    }

    this.processing = true;
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "amount": parseFloat(this.amount),
      "id": this.user.id
    }

    let url = `${Common.API_URL}convert-to-gav`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response
        this.processing = false;
        this.success = true;
        this.message = "Your transaction has been successfully confirmed.";
        this.userService.setFlash("Your transaction has been successfully confirmed.");
        $(".mfp-close").click();
        this.newEvent.emit(data);
      }, error => {
        this.processing = false;
        this.message = error.error.message;
      });
  }

  get receivable() {
    return (parseFloat(this.amount.replace(/,/g, '')) / 1000) - parseFloat(this.fee);
  }

  formatMoney(number) {
    number = parseFloat(number);
    return String(number.toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  openConfirm() {
    this.isConfirm = true;
  }

  onConfirm(data) {
    this.isConfirm = false;
    if (data == 'yes') {
      this.submit();
    }
  }
}
