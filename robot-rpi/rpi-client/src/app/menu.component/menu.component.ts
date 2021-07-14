import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Constant } from 'src/utils/constant';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  opened = true;
  modeNum = 0;
  positionNum = 0;
  dock = false;
  closeOnClickOutside = false;
  closeOnClickBackdrop = false;
  showBackdrop = false;
  animate = true;
  trapFocus = true;
  autoFocus = true;
  keyClose = false;
  autoCollapseHeight = 0;
  autoCollapseWidth = 0;

  MODES: Array<string> = ['over', 'push', 'slide'];
  POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.http.post(Constant.API.QUERY_MENU, {}).pipe(map((response: any) => {
    //   console.log(response)
    // })).subscribe();
    // this.http.post(Constant.API.SAVE_MENU, {'mqtt-local': {host: '192.168.3.12', port: 1883}}).pipe(map((response: any) => {
    //   console.log(response)
    // })).subscribe();
  }

  toggleOpened(): void {
    this.opened = !this.opened;
  }

  toggleMode(): void {
    this.modeNum++;

    if (this.modeNum === this.MODES.length) {
      this.modeNum = 0;
    }
  }

  toggleAutoCollapseHeight(): void {
    this.autoCollapseHeight = this.autoCollapseHeight ? 0 : 500;
  }

  toggleAutoCollapseWidth(): void {
    this.autoCollapseWidth = this.autoCollapseWidth ? 0 : 500;
  }

  togglePosition(): void {
    this.positionNum++;

    if (this.positionNum === this.POSITIONS.length) {
      this.positionNum = 0;
    }
  }

  toggleDock(): void {
    this.dock = !this.dock;
  }

  toggleCloseOnClickOutside(): void {
    this.closeOnClickOutside = !this.closeOnClickOutside;
  }

  toggleCloseOnClickBackdrop(): void {
    this.closeOnClickBackdrop = !this.closeOnClickBackdrop;
  }

  toggleShowBackdrop(): void {
    this.showBackdrop = !this.showBackdrop;
  }

  toggleAnimate(): void {
    this.animate = !this.animate;
  }

  toggleTrapFocus(): void {
    this.trapFocus = !this.trapFocus;
  }

  toggleAutoFocus(): void {
    this.autoFocus = !this.autoFocus;
  }

  toggleKeyClose(): void {
    this.keyClose = !this.keyClose;
  }

  onOpenStart(): void {
    console.info('Sidebar opening');
  }

  onOpened(): void {
    console.info('Sidebar opened');
  }

  onCloseStart(): void {
    console.info('Sidebar closing');
  }

  onClosed(): void {
    console.info('Sidebar closed');
  }

  onTransitionEnd(): void {
    console.info('Transition ended');
  }

  onBackdropClicked(): void {
    console.info('Backdrop clicked');
  }
}
