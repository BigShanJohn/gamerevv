import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit, OnChanges {
  @Input() video;
  safeUrlVideo: any;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['video']) {
      this.safeUrlVideo = this.safeUrl(this.video);
    }
  }
  safeUrl(video) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(video);
  }
}
