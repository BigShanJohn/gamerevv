import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';
declare var $: any;
import * as _ from 'lodash';

@Component({
  selector: 'app-new-proposal',
  templateUrl: './new-proposal.component.html',
  styleUrls: ['./new-proposal.component.css']
})
export class NewProposalComponent implements OnInit {
  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string = '';
  values = [];
  user: any;
  message: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  categoryId: string;
  featured: number = 0;
  processing: boolean = false;
  isConfirm: boolean = false
  isOkay: boolean = false;
  success: boolean = false;
  @Output() newEvent = new EventEmitter<string>();
  @Input() categories: any;
  @Input() category: any;
  @Input() balance: any;
  @Input() fee: any;

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
    if (this.category) {
      this.categoryId = this.category;
    }
  }

  get isLowFund() {
    return this.balance && parseFloat(this.fee.proposal) >= parseFloat(this.balance.GAV)
  }

  minimumAmount() {
    return this.fee ? parseFloat(this.fee.proposal) + 1 : 0;
  }

  submit() {

    this.message = null;
    let dateOptions: any = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    };
    this.isOkay = false;
    let now = new Date().toLocaleDateString('en-US', dateOptions);
    if (!this.title) {
      return this.message = "Title is required";
    }
    if (!this.description) {
      return this.message = "Proposal Description is required";
    }
    if (!this.startDate) {
      return this.message = "Start Date is required";
    }
    if (!this.endDate) {
      return this.message = "End Date is required";
    }
    if (Date.parse(this.startDate) > Date.parse(this.endDate)) {
      return this.message = "Start Date can't be after End Date";
    }
    if (Date.parse(now) > Date.parse(this.startDate)) {
      return this.message = "Start Date can't be a past date";
    }

    let someDate = new Date(this.startDate);
    someDate.setDate(someDate.getDate() + 5);
    if (Date.parse(someDate.toISOString().substr(0, 10)) < Date.parse(this.endDate)) {
      return this.message = "A proposal can't be more than 5 days";
    }

    let options = [];
    for (var i = 0; i < this.values.length; i++) {
      if (this.values[i].value.trim() != "") {
        options.push(this.values[i].value);
      }

    }
    if (options.length < 2) {
      return this.message = "Provide more than 1 voting option";
    }
    if (this.category) {
      this.categoryId = this.category;
    }

    this.processing = true;
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "title": this.title,
      "description": this.description,
      "featured": this.featured,
      "startDate": this.startDate,
      "endDate": this.endDate,
      "categoryId": this.categoryId,
      "image": this.cardImageBase64,
      "options": options.join('[]'),
      "id": this.user.id
    }

    let url = `${Common.API_URL}proposal-add`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response
        this.processing = false;
        this.isOkay = true;
        $(".mfp-close").click();
        this.newEvent.emit(data);
      }, error => {
        this.processing = false;
        this.message = error.error.message;
      });
  }


  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError = 'Maximum size allowed is ' + max_size / 1000 + 'Mb';

        return false;
      }

      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          if (img_height > max_height && img_width > max_width) {
            this.imageError =
              'Maximum dimentions allowed ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.isImageSaved = true;
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage() {
    this.cardImageBase64 = '';
    this.isImageSaved = false;
  }

  removevalue(i) {
    this.values.splice(i, 1);
  }

  addvalue() {
    this.values.push({ value: "" });
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
