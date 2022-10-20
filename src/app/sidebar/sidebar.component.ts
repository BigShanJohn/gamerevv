import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @Input() page: string;
  isDarkMode: boolean = false;
  constructor() { }

  ngOnInit() {
    this.loadExternalJs();
  }

  ngAfterViewInit(): void {
    var switchTheme = $('.js-switch-theme'),
      body = $('body');
    this.isDarkMode = body.hasClass('dark');
    switchTheme.on('change', function () {
      if (!body.hasClass('dark')) {
        body.addClass('dark');
        localStorage.setItem('darkMode', "on");
        this.isDarkMode = true;
      } else {
        body.removeClass('dark');
        localStorage.setItem('darkMode', "off");
        this.isDarkMode = false;
      }
    });
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

    var toggle = $('.sidebar__toggle'),
      page = $('.page'),
      sidebar = $('.sidebar'),
      headerToggle = $('.header__toggle'),
      logo = $('.header__logo'),
      close = $('.sidebar__close');
    toggle.on('click', function () {
      sidebar.toggleClass('active');
      page.toggleClass('wide');
      setTimeout(function () {
        $('.owl-carousel').trigger('refresh.owl.carousel');
      }, 200);
    });

    headerToggle.on('click', function () {
      sidebar.addClass('active');
      page.addClass('toggle');
      logo.addClass('hidden');
      $('body').addClass('no-scroll');
      $('html').addClass('no-scroll');
    });

    close.on('click', function () {
      sidebar.removeClass('active');
      page.removeClass('toggle');
      logo.removeClass('hidden');
      $('body').removeClass('no-scroll');
      $('html').removeClass('no-scroll');
    });
  }
}
