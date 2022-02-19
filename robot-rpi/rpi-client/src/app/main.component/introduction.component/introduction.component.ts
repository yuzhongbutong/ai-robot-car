import { Component } from '@angular/core';
import { EMPTY, interval, of, Subject } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent {

  images: Array<String> = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.png', '6.jpg', '7.jpeg', '8.jpg'];
  currentIndex: number = 0;
  carouselCurrentIndex: number = -1;
  carouselTargetIndex: number = -1;

  private isPauseRolling: boolean = false;
  private carouselSubject = new Subject<number>();

  constructor() {
    const imageLength = this.images.length;
    this.carouselSubject.pipe(
      map((target: number) => {
        this.carouselCurrentIndex = this.currentIndex;
        this.carouselTargetIndex = target;
        return target;
      }),
      delay(500),
      map((target: number) => {
        this.currentIndex = target;
        this.carouselCurrentIndex = -1;
        this.carouselTargetIndex = -1;
      })
    ).subscribe();

    interval(2000)
      .pipe(
        switchMap(() => {
          if (this.isPauseRolling) {
            return EMPTY;
          } else {
            const next = this.currentIndex >= imageLength - 1 ? 0 : this.currentIndex + 1;
            return of(next);
          }
        }),
        map((target: number) => {
          this.carouselCurrentIndex = this.currentIndex;
          this.carouselTargetIndex = target;
          return target;
        }),
        delay(500),
        map((target: number) => {
          this.currentIndex = target;
          this.carouselCurrentIndex = -1;
          this.carouselTargetIndex = -1;
        })
      ).subscribe()
  }

  switchCarousel(index: number): string {
    const criterion = this.images.length - 1;
    if (this.carouselCurrentIndex === index) {
      if (this.carouselTargetIndex === 0 && this.carouselCurrentIndex === criterion) {
        return 'carousel-item-start';
      } else if (this.carouselTargetIndex === criterion && this.carouselCurrentIndex === 0) {
        return 'carousel-item-end';
      } else if (this.carouselTargetIndex > this.carouselCurrentIndex) {
        return 'carousel-item-start';
      } else {
        return 'carousel-item-end';
      }
    } else if (this.carouselTargetIndex === index) {
      if (this.carouselTargetIndex === 0 && this.carouselCurrentIndex === criterion) {
        return 'carousel-item-next';
      } else if (this.carouselTargetIndex === criterion && this.carouselCurrentIndex === 0) {
        return 'carousel-item-prev';
      } else if (this.carouselTargetIndex > this.carouselCurrentIndex) {
        return 'carousel-item-next';
      } else {
        return 'carousel-item-prev';
      }
    }
    return '';
  }

  showCurrent(index: number) {
    if (this.currentIndex != index) {
      this.carouselSubject.next(index);
    }
  }

  previous() {
    const index = this.currentIndex > 0 ? this.currentIndex - 1 : this.images.length - 1;
    this.carouselSubject.next(index);
  }

  next() {
    const index = this.currentIndex >= this.images.length - 1 ? 0 : this.currentIndex + 1;
    this.carouselSubject.next(index);
  }

  pauseRolling(isPause: boolean) {
    this.isPauseRolling = isPause;
  }
}
