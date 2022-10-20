import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
declare var $: any;

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.css']
})
export class ProfileModalComponent implements OnInit {

  user: any;
  message: any;
  isProfile: boolean = true;
  isOkay: boolean = false;
  username: string;
  processing: boolean = false;
  success: boolean = false;
  isCopied: boolean = false;

  constructor(private router: Router, private userService: UserService, public http: HttpClient) {
    this.userService.init();
    this.user = this.userService.getUser();
  }


  ngOnInit() {
  }

  logout() {
    $(".mfp-close").click();
    this.userService.setUser(null);
    this.navigate('');
  }

  navigate(path) {
    this.router.navigateByUrl(path);
  }
  bscAddressLink(address) {
    return Common.NETWORK_URL + "address/" + address;
  }


  getPhoto(id) {
    if (!id) {
      id = 1;
    }
    return Common.IPFS +`revvcitizens%20%28${id}%29.png`;
  }

  submit() {

    this.message = null;
    this.isOkay = false;
    if (!this.username ) {
      return this.message = "Username can not be empty";
    }

    this.processing = true;
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "username": this.username,
      "id": this.user.id
    }

    let url = `${Common.API_URL}change-username`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response
        this.processing = false;
        this.isOkay = true;
        $(".mfp-close").click();
      }, error => {
        this.processing = false;
        this.message = error.error.message;
      });
  }

}
