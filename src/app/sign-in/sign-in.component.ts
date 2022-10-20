import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';
declare var Magic: any;

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {

  user: any;
  username: string;
  email: string;
  message: string;
  isProcessing: boolean = false;
  success: boolean = false;
  magic: any;
  isLoggedIn: any;

  constructor(private router: Router, public http: HttpClient, private userService: UserService) {
    this.userService.init();
    this.user = this.userService.getUser();
    if (this.user) {
      this.navigate('home');
    }

    const BSCOptions = {
      rpcUrl: Common.RPC_URL, // Smart Chain - Testnet RPC URL
      chainId: Common.CHAIN_ID, // Smart Chain - Testnet chain id
    };


    this.magic = new Magic(Common.PUBLIC_MAGIC_LINK_KEY, { network: BSCOptions });
  }

  ngOnInit() {
    this.userService.init();
    this.user = this.userService.getUser();
    if (this.user) {
      this.navigate('home');
    }
  }

  async magicInstance() {
    this.isLoggedIn = await this.magic.user.isLoggedIn();

    if (this.isLoggedIn) {
      /* Get user metadata including email */
      this.user = await this.magic.user.getMetadata();
      this.saveUser();
    } else {
      this.isProcessing = false;
      this.message = "Failed to Authenticate";
    }
  }

  async handleLogin() {
    this.isProcessing = true;
    if (!this.email) {
      return this.message = "Email is required";
    }

    if (!this.validateEmail(this.email)) {
      return this.message = "Email is not valid";
    }

    /* One-liner login 🤯 */
    const params: any = { email: this.email, redirectURI: Common.APP_URL + 'home' };
    const result = await this.magic.auth.loginWithMagicLink(params); // 👈 Notice the additional parameter!

    this.magicInstance();
  };

  validateEmail(email) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  }

  saveUser() {
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "email": this.user.email,
      "issuer": this.user.issuer,
      "isMfaEnabled": this.user.isMfaEnabled,
      "address": this.user.publicAddress,
    }

    let url = `${Common.API_URL}user-add`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response;
        this.userService.setUser(data.data);
        this.navigate('home');
        this.success = true;
        this.message = "Welcome Back";
        this.isProcessing = false;
      }, error => {
        this.message = error.error.message;
        this.isProcessing = false;
      });
  }

  navigate(path) {
    this.router.navigateByUrl(path);
  }

}
