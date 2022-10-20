import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import * as moment from 'moment';

declare var $: any;
declare var ApexCharts: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  user: any;
  posts: any;
  message: string;
  balance: any;
  histories: any;
  history: any;
  transactionFee: any;
  successMessage: string = null;
  pageLoader: number = 0;
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartData: SingleDataSet = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(private router: Router, public http: HttpClient, private userService: UserService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.userService.init();
    this.user = this.userService.getUser();
    if (!this.user) {
      this.navigate('');
    }
    if (this.user.expireTime < new Date()) {
      //this.userService.setUser(null);
      //this.navigate('');
    }

  }

  getImageURL(image) {
    return Common.API_URL + image;
  }


  getSymbol(address) {
    if (address == Common.GAM) {
      return 'GAM';
    }
    else if (address == Common.GAV) {
      return 'GAV';
    }
    return 'WBNB';
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

  formatMoney(number) {
    number = parseFloat(number);
    return String(number.toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  ngAfterViewInit() {
    this.loadExternalJs();
    this.successMessage = this.userService.getFlash();
    if (this.successMessage) {
      setTimeout(() => {
        $("#successModal").click();
        this.userService.clearFlash();
      }, 5000);
    }
  }

  ngOnInit() {
    this.getPosts();
    this.getBalance();
    this.getHistories();
    this.getTransactionFee();

  }

  reloadData(data) {
    if (data) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/']);
      });
    }
  }
  navigate(path) {
    this.router.navigateByUrl(path);
  }
  get total() {
    return parseFloat(this.balance.price_USD) ? (parseFloat(this.balance.price_USD) * parseFloat(this.balance.GAV)) + (parseFloat(this.balance.price_USD) * parseFloat(this.balance.GAM) / 1000) + ((parseFloat(this.balance.price_USD) / parseFloat(this.balance.price_BNB)) * parseFloat(this.balance.BNB)) : 0;
  }

  getPosts() {
    this.message = null;

    let url = `${Common.API_URL}post-latest`;
    this.http.get(url)
      .subscribe(response => {
        this.pageLoader++;
        let data: any = response
        if (data.success) {
          this.posts = data.post;
          setTimeout(() => {
            try {
              // carousel arrows
              var navArrows = ['\n    <svg class="icon icon-arrow-prev">\n        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/sprite.svg#icon-arrow-prev"></use>\n    </svg>', '<svg class="icon icon-arrow-next">\n        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/sprite.svg#icon-arrow-next"></use>\n    </svg>'];

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
                items: 5,
                nav: false,
                dots: true,
                loop: true,
                smartSpeed: 700,
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
            }
            catch (ex) { }
          }, 200);

        }
        else {
          this.message = data.message;
        }
      }, error => {
        this.message = error.error.message;
      });
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
        let data: any = response
        this.pageLoader++;
        if (data.success) {
          this.balance = data.data;
          this.plotGraph();
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
        this.pageLoader++;
        let data: any = response
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
      "limit": 5,
      "offset": 0
    }

    let url = `${Common.API_URL}transaction-histories`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response
        this.histories = data.result;
        this.pageLoader++;

      }, error => {
        this.message = error.error.message;
      });
  }

  plotGraph() {
    try {
      let chart = document.querySelector('#chart-total-balance');
      let GAMValue = parseFloat(this.balance.price_USD) * parseFloat(this.balance.GAM) / 1000;
      let BNBValue = (parseFloat(this.balance.price_USD) / parseFloat(this.balance.price_BNB)) * parseFloat(this.balance.BNB);
      let GAVValue = parseFloat(this.balance.price_USD) * parseFloat(this.balance.GAV);
      let GAMPercentage = (GAMValue / this.total) * 100;
      let GAVPercentage = (GAVValue / this.total) * 100;
      let BNBPercentage = (BNBValue / this.total) * 100;
      if (chart != null) {
        let options = {
          series: [GAVPercentage.toFixed(2), GAMPercentage.toFixed(2), BNBPercentage.toFixed(2)],
          chart: {
            height: '100%',
            type: 'radialBar'
          },
          plotOptions: {
            radialBar: {
              dataLabels: {
                name: {
                  fontSize: '16px'
                },
                value: {
                  fontSize: '14px'
                },
                total: {
                  show: false
                }
              }
            }
          },
          colors: [Common.purple, Common.green, Common.red],
          labels: ['GAV', 'GAM', 'BNB']
        };

        new ApexCharts(chart, options).render();
      }
    } catch (ex) { }
  }

  formatDate(date) {
    return moment(date).format('YYYY MMM DD h:mm');
  }

  isFrom(address1, address2) {
    return address1.toLowerCase().trim() === address2.toLowerCase().trim();
  }

  getNotificationTitle(from, to, token) {
    let title = ""
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

  isSwap(address) {
    return this.isFrom(address, Common.PANCAKE);
  }
}
