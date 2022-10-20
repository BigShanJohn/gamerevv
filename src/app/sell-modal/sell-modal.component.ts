import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';
import { ABI } from '../ABI';
declare var $: any;
declare var Magic: any;
declare var Web3: any;

@Component({
  selector: 'app-sell-modal',
  templateUrl: './sell-modal.component.html',
  styleUrls: ['./sell-modal.component.css']
})
export class SellModalComponent implements OnInit {
  @Input() balance: any;
  @Input() fee: any;
  @Output() newEvent = new EventEmitter<string>();
  user: any;
  message: string;
  amount: string;
  processing: boolean = false;
  isOkay: boolean = false;
  isConfirm: boolean = false;
  magic: any;
  web3: any;
  constructor(private router: Router, public http: HttpClient, private userService: UserService) {
    this.userService.init();
    this.user = this.userService.getUser();
    const BSCOptions = {
      rpcUrl: Common.RPC_URL, // Smart Chain - Testnet RPC URL
      chainId: Common.CHAIN_ID, // Smart Chain - Testnet chain id
    };

    this.magic = new Magic(Common.PUBLIC_MAGIC_LINK_KEY, { network: BSCOptions });
    this.web3 = new Web3(this.magic.rpcProvider);
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

  async sell(amount) {
    // Get user's Ethereum public address
    const fromAddress = (await this.web3.eth.getAccounts())[0];

    const GAVContract = await new this.web3.eth.Contract(ABI.GAV, Common.GAV);
    const GAVBalance = await GAVContract.methods.balanceOf(fromAddress).call();
    const GAVToken = this.web3.utils.fromWei(GAVBalance, 'ether');

    if (parseFloat(GAVToken) < amount) {
      this.message = 'Insufficient Token';
      return false;
    }

    const PancakeContract = await new this.web3.eth.Contract(ABI.Pancake, Common.PANCAKE);
    const deadline = Math.round(Date.now() / 1000) + 60 * 20;
    const path = [Common.GAV, Common.BNB];
    const finalAmount = this.web3.utils.toWei(amount.toString());
    const minAmount = 0;
    const amountOutMin = this.web3.utils.toWei(minAmount.toString());

    try {
      await GAVContract.methods.approve(Common.GAV, GAVBalance).send({
        'from': fromAddress,
        gas: 2000000,
      });
    }
    catch (ex) {
      this.message = 'Transaction failed';
      return false;
    }
    try {
      const receipt = await PancakeContract.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
        finalAmount, amountOutMin,
        path,
        fromAddress,
        deadline
      ).send({
        from: fromAddress,
        gas: 5000000,
        to: Common.PANCAKE,
      });
      return receipt;
    } catch (ex) {
      this.message = 'Transaction failed';
      return false;
    }

  }

  submit() {

    this.processing = true;
    this.isOkay = false;
    this.message = null;
    this.amount = this.amount.replace(/,/g, '');
    if (!this.amount) {
      return this.message = "Amount is required";
    }

    if (isNaN(parseFloat(this.amount))) {
      return this.message = "Invalid Amount";
    }
    this.sell(this.amount).then((result) => {
      if (!result) {
        this.processing = false;
        this.isOkay = false;
        return;
      }

      var headers = new HttpHeaders();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');
      const requestOptions = { headers: headers };

      let userData = {
        "amount": parseFloat(this.amount),
        "id": this.user.id
      }

      let url = `${Common.API_URL}sell`;
      this.http.post(url, userData, requestOptions)
        .subscribe(response => {
          let data: any = response
          this.processing = false;
          this.isOkay = true;
          setTimeout(() => this.isOkay = false, 10000);
          $(".mfp-close").click();
          this.newEvent.emit(data);
        }, error => {
          this.processing = false;
        this.isOkay = false;
          this.message = error.error.message;
        });
    });
  }

  get receivable() {
    return this.amount ? (parseFloat(this.amount.replace(/,/g, '')) * parseFloat(this.balance.price_BNB)) : 0;
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
