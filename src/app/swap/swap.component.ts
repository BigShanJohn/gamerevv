import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as moment from 'moment';

declare var $: any;
declare var ApexCharts: any;
declare var TradingView: any;
declare var Magic: any;
declare var Web3: any;

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.css']
})
export class SwapComponent implements OnInit, AfterViewInit {
  message: string;
  twentyFourHour: any;
  user: any;
  option: string = '30-m'
  limit: number = 6;
  data;
  balance: any;
  transactionFee: any;
  isSellTab: boolean = false;
  pageLoader: number = 0;

  constructor(private router: Router, public http: HttpClient, private userService: UserService) {
    this.userService.init();
    this.user = this.userService.getUser();
    
  }

  

  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];

  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  ngOnInit() {
    this.getTwentyFourHour();
    //this.getGraph();
    this.getBalance();
    this.getTransactionFee();
    new TradingView.widget(
      {
        "auto_size": true,
        "symbol": "BINANCE:GALAUSDT",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_8c007"
      }
    );
  }

  reloadData(data) {
    if (data) {
      this.getBalance();
    }
  }

  getTwentyFourHour() {
    this.message = null;


    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "option": "1-d",
      "limit": 2
    }

    let url = `${Common.API_URL}price-graph`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response
        this.twentyFourHour = data;
        this.pageLoader++;
      }, error => {
        this.message = error.error.message;
      });
  }
  getGraph() {
    this.message = null;
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "option": this.option,
      "limit": this.limit
    }

    let url = `${Common.API_URL}price-graph`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response
        this.data = data;
        let formatDates: any = [];
        for (var i = 0; i < this.data.dates.length; i++) {
          formatDates.push(moment(this.data.dates[i]).format('LLL'));
        }
        this.lineChartData = [
          { data: this.data.usdPrices, label: 'Price' },
        ];
        this.lineChartLabels = formatDates;
      }, error => {
        this.message = error.error.message;
      });
  }
  getPercentage(price1, price2) {
    return ((parseFloat(price1) - parseFloat(price2)) / parseFloat(price1)) * 100;
  }

  getTransactionFee() {
    this.message = null;


    let url = `${Common.API_URL}transaction-fee`;
    this.http.get(url,)
      .subscribe(response => {
        let data: any = response
        this.transactionFee = data;
        this.pageLoader++;
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

  ngAfterViewInit() {

  }
  formatMoney(number) {
    number = parseFloat(number);
    return String(number.toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}
