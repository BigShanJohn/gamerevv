import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../user.service';
import { Common } from '../common';
@Component({
  selector: 'app-actvity-modal',
  templateUrl: './actvity-modal.component.html',
  styleUrls: ['./actvity-modal.component.css']
})
export class ActvityModalComponent implements OnInit {
  @Input() history;
  user: any;

  constructor(private userService: UserService) {
    this.userService.init();
    this.user = this.userService.getUser();
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

  ngOnInit() {
  }

  isFrom(address1, address2) {
    return address1.toLowerCase().trim() === address2.toLowerCase().trim();
  }

  bscAddressLink(address) {
    return Common.NETWORK_URL + "address/" + address;
  }

  bscTransactionLink(address) {
    return Common.NETWORK_URL + "tx/" + address;
  }

  formatMoney(number) {
    var value = (number).toLocaleString(
      undefined, // leave undefined to use the visitor's browser 
      // locale or a string like 'en-US' to override it.
      { minimumFractionDigits: 2 }
    );
    return value;
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
}
