import { Component, OnInit } from '@angular/core';
import { Router, Event, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import { UserService } from '../user.service';
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  id: string;
  message: string;
  balance: any;
  game: any;
  user: any;
  pageLoader: number = 0;
  url: SafeResourceUrl;
  index: number = 1;
  selectedVideo;
  showGame: boolean = false;
  fullscreen: boolean = false;
  slides = [];
  elem;
  gameGAM;
  creatorGAM;
  userGAM;
  gameMessage;
  isConfirm: boolean = false;
  slideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": true,
    "arrows": true,
    "speed": 700,
    "fade": true,
    "loop": true
  };

  constructor(private sanitizer: DomSanitizer, public http: HttpClient, private userService: UserService, private router: Router, private route: ActivatedRoute) {
    this.userService.init();
    this.user = this.userService.getUser();
    if (!this.user) {
      this.navigate('');
    }
  }

  get total() {
    return (this.balance.price_USD * this.balance.GAV) + (this.balance.price_USD * this.balance.GAM / 1000) + ((this.balance.price_USD / this.balance.price_BNB) * this.balance.BNB);
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


  get GAMValue() {
    return this.balance.price_USD * this.balance.GAM / 1000;
  }
  get BNBValue() {
    return (this.balance.price_USD / this.balance.price_BNB) * this.balance.BNB;
  }
  get GAVValue() { return this.balance.price_USD * this.balance.GAV; }
  get GAMPercentage() {
    return (this.GAMValue / this.total) * 100;
  }
  get GAVPercentage() { return (this.GAVValue / this.total) * 100; }
  get BNBPercentage() { return (this.BNBValue / this.total) * 100; }

  openVideo(video) {
    this.selectedVideo = video;
    $('#openVideoModal').click();
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.getGame();
    this.getBalance();
  }

  formatMoney(number) {
    number = parseFloat(number);
    return number ? String(number.toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0.00;
  }

  navigate(path) {
    this.router.navigateByUrl(path);
  }

  addSlide(img) {
    this.slides.push({ img: img })
  }

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(e) {
  }

  breakpoint(e) {

  }

  afterChange(e) {

  }

  beforeChange(e) {

  }

  getPhoto(id) {
    if (!id) {
      id = 1;
    }
    return Common.API_URL + `uploads/revvcitizen/revvcitizens%20(${id}).png`;
  }

  openConfirm() {
    this.isConfirm = true;
    $("#popup-button").click();
  }

  onConfirm(data) {
    this.isConfirm = false;
    if (data == 'yes') {
      this.gameDeposit();
    }
  }

  gameDeposit() {
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "address": this.user.address,
      "game_id": this.id,
      "GAM": this.game.gamRequirement
    }

    let url = `${Common.API_URL}deposit`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        this.showGame = !this.showGame;
        let data: any = response;
        this.userGAM = data.userGame && data.userGame.GAM ? data.userGame.GAM : 0;
        $(".mfp-close").click();
      }, error => {
        this.message = error.error.message;
        $(".mfp-close").click();
      });

  }

  customDeposit() {
    $("#popup-button-deposit").click();
  }

  claim() {
    $("#popup-button-claim").click();
  }

  playGame() {
    if (parseInt(this.userGAM) > 0) {
      this.showGame = !this.showGame;
      return;
    }
    this.gameMessage = 'To play ' + this.game.title + ', do you agree to deposit ' + this.game.gamRequirement + '?'
    this.openConfirm();
  }

  getGame() {
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "id": this.id
    }

    let url = `${Common.API_URL}game-one`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response;
        this.pageLoader++;
        this.game = data.game;
        this.addSlide(Common.API_URL + this.game.backgroundImage);
        this.addSlide(Common.API_URL + this.game.backgroundImage2);
        this.addSlide(Common.API_URL + this.game.backgroundImage3);
        this.url = this.safeUrl(this.game.url + '?a=' + this.user.address);
        this.getGameGAM();
        this.getUserGAM();
      }, error => {
        this.message = error.error.message;
      });
  }


  reloadData(data) {
    if (data) {
      this.userGAM = data.userGame && data.userGame.GAM ? data.userGame.GAM : 0;
    }
  }

  getGameGAM() {
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "game_id": this.id,
      "address": this.game.address
    }

    let url = `${Common.API_URL}user-game`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response;
        this.gameGAM = data.userGame && data.userGame.GAM ? data.userGame.GAM : 0;
      }, error => {

      });
  }

  getUserGAM() {
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const requestOptions = { headers: headers };

    let userData = {
      "game_id": this.id,
      "address": this.user.address
    }

    let url = `${Common.API_URL}user-game`;
    this.http.post(url, userData, requestOptions)
      .subscribe(response => {
        let data: any = response;
        this.userGAM = data.userGame && data.userGame.GAM ? data.userGame.GAM : 0;
      }, error => {

      });
  }

  safeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openFullscreen() {
    this.elem = document.getElementById("iframe");
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

}
