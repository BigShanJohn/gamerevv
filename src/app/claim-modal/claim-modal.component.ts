import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';
declare var $: any;
@Component({
  selector: 'app-claim-modal',
  templateUrl: './claim-modal.component.html',
  styleUrls: ['./claim-modal.component.css']
})
export class ClaimModalComponent implements OnInit {
  @Input() GAM: any;
  @Input() game: any;
  @Input() title: any;
  @Output() newEvent = new EventEmitter<string>();
  user: any;
  message: string;
  amount: string;
  amountError: string;
  processing: boolean = false;
  success: boolean = false;
  isConfirm: boolean = false;

  constructor(private router: Router, public http: HttpClient, private userService: UserService) {
    this.userService.init();
    this.user = this.userService.getUser();
  }

  formatMoney(number) {
    number = parseFloat(number);
    return String(number.toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

  }

  submit() {
    this.message = null;
    this.amount = this.amount ? this.amount.replace(/,/g, '') : null;
    this.amountError = null;
    if (!this.amount) {
      this.amountError = "Amount is required";
      return this.message = "Amount is required";
    }

    if (isNaN(parseFloat(this.amount))) {
      this.amountError = "Invalid Amount";
      return this.message = "Invalid Amount";
    }
    if (parseFloat(this.GAM) < parseFloat(this.amount)) {
      this.amountError = "Insufficient Fund";
      return this.message = "Insufficient Fund";
    }

    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "GAM": this.amount,
      "address": this.user.address,
      "game_id": this.game.id
    }
    this.processing = true;

    let url = `${Common.API_URL}claim`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        console.log(response);
        let data: any = response
        if (data.success) {
          this.newEvent.emit(data);
          $(".mfp-close").click();
        }
        else {
          this.message = data.message;
        }
        this.processing = false;
      }, error => {
        console.log(error);
        this.message = error.error.message;
        this.processing = false;
      });
  }


  navigate(path) {
    this.router.navigateByUrl(path);
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
