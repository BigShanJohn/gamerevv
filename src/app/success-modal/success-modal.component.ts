import { Component, OnInit, Input } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.css']
})
export class SuccessModalComponent implements OnInit {
  @Input() successMessage: string;
  constructor() { }

  ngOnInit() {
  }

  ok() {
    $(".mfp-close").click();
  }

}
