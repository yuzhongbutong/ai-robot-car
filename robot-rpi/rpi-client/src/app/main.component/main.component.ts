import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Constant } from 'src/utils/constant';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  isMenuFloat = false;
  // @ViewChild(MatSidenav)
  // sidenav!: MatSidenav;

  constructor(private observer: BreakpointObserver) { }

  ngOnInit(): void {
    // this.http.post(Constant.API.QUERY_MENU, {}).pipe(map((response: any) => {
    //   console.log(response)
    // })).subscribe();
    // this.http.post(Constant.API.SAVE_MENU, {'mqtt-local': {host: '192.168.3.12', port: 1883}}).pipe(map((response: any) => {
    //   console.log(response)
    // })).subscribe();
  }

  ngAfterViewInit() {
    this.observer
      .observe(['(min-width: 992px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.isMenuFloat = false;
        }
      });
  }

  toggleMenuFloat() {
    this.isMenuFloat = !this.isMenuFloat;
  }
}
