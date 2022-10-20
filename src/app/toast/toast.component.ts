import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  @Input() message: string;
  @Input() success: boolean = false;
  showToast: boolean = false
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.message && this.message.trim().length > 3) {
      this.showToast = true;
      setTimeout(() => this.showToast = false, 5000);
    }
  }
}
