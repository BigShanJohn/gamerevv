import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Common } from '../common';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit, AfterViewInit {
  user: any;
  message: string;
  games: any;
  currentGames: any;
  upcomingGames: any;
  selectedVideo: string = null;
  pageLoader: number = 0;

  constructor(private router: Router, private userService: UserService, public http: HttpClient) {
    this.userService.init();
    this.user = this.userService.getUser();
  }


  ngOnInit() {
    this.getGames();
  }

  getImageURL(image) {
    return Common.API_URL + image;
  }

  ngAfterViewInit() {
    if (this.isTouchDevice()) {
      $('body').addClass('touch-device');
    }
    try {
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
    catch (ex) { }
  }
  openVideo(video) {
    this.selectedVideo = video;
    $('#openVideoModal').click();
  }

  getGames() {
    this.message = null;

    let url = `${Common.API_URL}game-all-active`;
    this.http.get(url)
      .subscribe(response => {
        let data: any = response
        if (data.success) {
          this.games = _(data.games)
            .orderBy('dateCreated', 'desc')
            .value();

          this.currentGames = this.games.filter(function (el) {
            let dateOptions: any = {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            };
            let now = new Date().toLocaleDateString('en-US', dateOptions);

            return Date.parse(el.launchDate) <= Date.parse(now);
          });

          this.upcomingGames = this.games.filter(function (el) {
            let dateOptions: any = {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            };
            let now = new Date().toLocaleDateString('en-US', dateOptions);

            return Date.parse(el.launchDate) > Date.parse(now);
          });
          setTimeout(() => this.loadSlider(), 1000);
        }
        else {
          this.message = data.message;
        }
      }, error => {
        this.message = error.error.message;
      });
  }

  isTouchDevice() {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var mq = function mq(query) {
      return window.matchMedia(query).matches;
    };
    if ('ontouchstart' in window) {
      return true;
    }
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
  }


  loadSlider() {
    this.pageLoader++;
    // global variables
    var prevArrow = '<button type="button" class="slick-prev"></button>',
      nextArrow = '<button type="button" class="slick-next"></button>';


    // categories slider
    $('.js-slider-categories').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: false,
      arrows: true,
      prevArrow: prevArrow,
      nextArrow: nextArrow,
      speed: 700,
      fade: true
    });

    // slider main page

    var main = $('.js-main'),
      sliderNav = main.find('.js-main-nav'),
      sliderFor = main.find('.js-main-for'),
      progressBar = main.find('.js-main-progress');

    sliderFor.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
      var calc = nextSlide / (slick.slideCount - 1) * 100;

      progressBar.css('background-size', calc + '% 100%').attr('aria-valuenow', calc);
    });

    sliderFor.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: prevArrow,
      nextArrow: nextArrow,
      fade: true,
      asNavFor: sliderNav,
      speed: 700
    });

    sliderNav.slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: sliderFor,
      arrows: true,
      prevArrow: prevArrow,
      nextArrow: nextArrow,
      dots: false,
      focusOnSelect: true,
      speed: 700,
      responsive: [{
        breakpoint: 768,
        settings: {
          slidesToShow: 3
        }
      }]
    });

    // trending slider

    var main = $('.js-main'),
      slider = main.find('.js-main-slider'),
      status = main.find('.js-main-status'),
      counter = main.find('.js-main-counter');

    slider.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
      //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
      var i = (currentSlide ? currentSlide : 0) + 1;
      counter.html('0' + i);
      status.html('<span class="status__number">' + i + '</span>' + '<span class="status__sign">/</span>' + '<span class="status__all">' + slick.slideCount + '</span>');
    });

    slider.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      prevArrow: prevArrow,
      nextArrow: nextArrow,
      dots: true,
      infinite: false,
      speed: 700,
      variableWidth: true,
      autoplay: true,
      autoplaySpeed: 5000,
      responsive: [{
        breakpoint: 768,
        settings: {
          variableWidth: false,
          arrows: true,
          dots: false
        }
      }]
    });

    // latest video slider
    $('.js-slider-videos').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: false,
      arrows: true,
      prevArrow: prevArrow,
      nextArrow: nextArrow,
      speed: 700,
      fade: true
    });

    $('.js-slider-streamers').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: prevArrow,
      nextArrow: nextArrow,
      speed: 600,
      adaptiveHeight: true,
      responsive: [{
        breakpoint: 9999,
        settings: "unslick"
      }, {
        breakpoint: 1420,
        settings: ""
      }, {
        breakpoint: 1260,
        settings: {
          slidesToShow: 3
        }

      }, {
        breakpoint: 768,
        settings: "unslick"
      }]
    });

    $('.js-slider-games').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: prevArrow,
      nextArrow: nextArrow,
      speed: 600,
      adaptiveHeight: true,
      responsive: [{
        breakpoint: 9999,
        settings: "unslick"
      }, {
        breakpoint: 1420,
        settings: ""
      }, {
        breakpoint: 1260,
        settings: {
          slidesToShow: 2
        }

      }, {
        breakpoint: 768,
        settings: "unslick"
      }]
    });

    $('.js-slider-view').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
      speed: 600,
      responsive: [{
        breakpoint: 9999,
        settings: "unslick"
      }, {
        breakpoint: 1340,
        settings: ""
      }, {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }

      }]
    });

  }
}
