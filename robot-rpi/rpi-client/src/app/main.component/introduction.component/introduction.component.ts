import { Component } from '@angular/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent {

  images: Array<String> = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];
  currentIndex: number = 0;

  private timer;
  private isPauseRolling: boolean = false;

  constructor() {
    const imageLength = this.images.length;
    this.timer = setInterval(() => {
      if (this.isPauseRolling) {
        return;
      }
      if (this.currentIndex >= imageLength - 1) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
    }, 2000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  showCurrent(index: number) {
    this.currentIndex = index;
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1;
    }
  }

  next() {
    if (this.currentIndex >= this.images.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
  }

  pauseRolling(isPause: boolean) {
    this.isPauseRolling = isPause;
  }
}
