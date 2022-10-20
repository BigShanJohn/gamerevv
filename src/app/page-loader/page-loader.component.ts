import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.css']
})
export class PageLoaderComponent implements OnInit {
  @Input() pageLoader: number = 0;
  @Input() max: number = 0;
  constructor() { }

  ngOnInit() {
  }

}
