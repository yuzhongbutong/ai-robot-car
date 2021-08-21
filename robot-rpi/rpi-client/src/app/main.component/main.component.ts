import { Component } from '@angular/core';
import { delay } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  isMenuFloat = false;

  constructor(private observer: BreakpointObserver) { }

  ngAfterViewInit() {
    this.observer
      .observe(['(min-width: 992px)'])
      .pipe(delay(1))
      .subscribe((res: any) => {
        if (res.matches) {
          this.isMenuFloat = false;
        }
      });
  }

  toggleMenuFloat() {
    this.isMenuFloat = !this.isMenuFloat;
  }
}
