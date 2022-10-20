import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit, AfterViewInit {
  isDarkMode: boolean = false;
  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit(): void {
    let body = $('body');
    this.isDarkMode = body.hasClass('dark');
  }

}
