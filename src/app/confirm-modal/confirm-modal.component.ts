import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {
  @Input() message;
  @Output() confirm = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
    if(!this.message){
      this.message = 'Do you want to go ahead with this transaction?';
    }
  }

  yes() {
    this.confirm.emit('yes');
  }
  no() {
    this.confirm.emit('no');
  }
}
