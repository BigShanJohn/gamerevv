import { Component, OnInit, Input } from '@angular/core';
import { Common } from '../common';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  @Input() user: any;
  isCopied: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  bscAddressLink(address) {
    return Common.NETWORK_URL + "address/" + address;
  }
}
