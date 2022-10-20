import { Component, OnInit } from '@angular/core';
import { Router, Event, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-proposal-details',
  templateUrl: './proposal-details.component.html',
  styleUrls: ['./proposal-details.component.css']
})
export class ProposalDetailsComponent implements OnInit {
  id: string;
  message: string;
  proposal: any;
  options: any;
  selectedOption: string;
  user: any;
  block: number;
  counts: any = [];
  addresses: any = [];
  weight: any = [];
  optionIds: any = [];
  processing: boolean = false;
  isOkay: boolean = false;
  fee: any;
  pageLoader: number = 0;

  constructor(public http: HttpClient, private userService: UserService, private router: Router, private route: ActivatedRoute) {
    this.userService.init();
    this.user = this.userService.getUser();
    if (!this.user) {
      this.navigate('');
    }
  }

  getImageURL(image) {
    return Common.API_URL + image;
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.getProposal();
    this.getTransactionFee();
  }

  selectOption(id) {
    this.selectedOption = id;
  }

  getProposal() {
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "id": this.id
    }

    let url = `${Common.API_URL}proposal-one`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        console.log(response);
        let data: any = response;
        this.pageLoader++;
        console.log(data);
        this.proposal = JSON.parse(data.proposal);
        this.options = JSON.parse(data.options);
        this.proposal = this.proposal[0];
        this.block = data.block;
        this.addresses = data.addresses.split(',');
        this.weight = data.weight.split(',');
        this.optionIds = data.optionsId.split(',');
        this.counts = data.counts.split(',');
        console.log(this.options)
      }, error => {
        console.log(error);
        this.message = error.error.message;
      });
  }

  getCount(id) {
    let voter = [];
    for (var i = 0; i < this.optionIds.length; i++) {
      if (this.optionIds[i] == id) {
        return this.counts[i]
      }
    }

    return 0;
  }

  get blockURL() {
    return Common.NETWORK_URL + 'block/' + this.block;
  }

  get voters() {
    let voter = [];
    for (var i = 0; i < this.addresses.length; i++) {
      if (this.addresses[i]) {
        voter.push({
          address: this.addresses[i],
          weight: this.weight[i]
        })
      }

    }

    return voter;
  }

  bscAddressLink(address) {
    return Common.NETWORK_URL + "address/" + address;
  }


  get hasVoted() {
    return this.addresses.includes(this.user.address)
  }

  truncate(address) {
    return '0x***' + address.substr(address.length - 3, 4);
  }

  vote() {
    this.processing = true;
    this.isOkay = false;
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };
    if (!this.selectedOption) {
      return this.message = "You have to select an option";
    }
    let userData = {
      "id": this.user.id,
      "optionId": this.selectedOption,
      "proposalId": this.id,
      "proposalTitle": this.proposal.title
    }

    let url = `${Common.API_URL}vote`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        console.log(response);
        let data: any = response;
        this.isOkay = true;
        this.getProposal();
        this.processing = false;
      }, error => {
        console.log(error);
        this.message = error.error.message;
      });
  }

  navigate(path) {
    this.router.navigateByUrl(path);
  }

  getTransactionFee() {
    this.message = null;


    let url = `${Common.API_URL}transaction-fee`;
    this.http.get(url,)
      .subscribe(response => {
        console.log(response);
        let data: any = response
        this.fee = data.fees;
      }, error => {
        console.log(error);
        this.message = error.error.message;
      });
  }
}
