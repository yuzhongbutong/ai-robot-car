import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { Constant } from 'src/utils/constant';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  tapActiveIndex = 1;
  connectActiveIndex = 0;
  toastActiveIndex = 0;
  internalForm: FormGroup = new FormGroup({
    host: new FormControl('', [
      Validators.required,
      Validators.maxLength(100)
    ]),
    port: new FormControl('', [
      Validators.maxLength(5),
      Validators.pattern(/^[\d]{0,5}$/)
    ]),
    userName: new FormControl('', [
      Validators.maxLength(40)
    ]),
    password: new FormControl('', [
      Validators.maxLength(40)
    ])
  });
  watsonForm: FormGroup = new FormGroup({
    orgId: new FormControl('', [
      Validators.required,
      Validators.maxLength(10)
    ]),
    userName: new FormControl('', [
      Validators.required,
      Validators.maxLength(40)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(40)
    ])
  });
  private originData: any = {};
  private toastSubject = new Subject();

  constructor(private http: HttpClient) {
    this.toastSubject.pipe(switchMap(value => of(value).pipe(delay(3000)))).subscribe(() => this.toastActiveIndex = 0);
  }

  ngOnInit(): void {
    this.http.post(Constant.API.QUERY_SETTINGS, {}).pipe(map((response: any) => {
      const { client_type, data } = response
      if (client_type === Constant.KEY.INTERNAL) {
        this.connectActiveIndex = 1;
      } else if (client_type === Constant.KEY.WATSON) {
        this.connectActiveIndex = 2;
      }
      this.originData = data;
      const { internal, watson } = data;
      this.internalForm.patchValue(internal);
      this.watsonForm.patchValue(watson);
    })).subscribe();
  }

  connectInternal() {
    if (this.internalForm.valid) {
      const internal = this.internalForm.value;
      Object.keys(internal).forEach((key) => !internal[key] && delete internal[key]);
      this.http.post(Constant.API.CONNECT_SETTINGS, { internal }).pipe(map((response: any) => {
        const { status, client_type } = response;
        if (status === 200) {
          this.showToast(1);
          if (client_type === Constant.KEY.INTERNAL) {
            this.connectActiveIndex = 1;
          } else {
            this.connectActiveIndex = 0;
          }
        } else {
          this.showToast(2);
        }
      })).subscribe();
    }
  }

  saveInternal(): void {
    if (this.internalForm.valid) {
      const internal = this.internalForm.value;
      Object.keys(internal).forEach((key) => !internal[key] && delete internal[key]);
      this.http.post(Constant.API.SAVE_SETTINGS, { internal }).pipe(map((response: any) => {
        if (response.status === 200) {
          this.originData.internal = internal;
          this.showToast(1);
        } else {
          this.showToast(2);
        }
      })).subscribe();
    }
  }

  resetInternal(): void {
    this.internalForm.patchValue(this.originData.internal);
  }

  connectWatson() {
    if (this.watsonForm.valid) {
      const watson = this.watsonForm.value;
      Object.keys(watson).forEach((key) => !watson[key] && delete watson[key]);
      this.http.post(Constant.API.CONNECT_SETTINGS, { watson }).pipe(map((response: any) => {
        const { status, client_type } = response;
        if (status === 200) {
          this.showToast(1);
          if (client_type === Constant.KEY.WATSON) {
            this.connectActiveIndex = 2;
          } else {
            this.connectActiveIndex = 0;
          }
        } else {
          this.showToast(2);
        }
      })).subscribe();
    }
  }

  saveWatson(): void {
    if (this.watsonForm.valid) {
      const watson = this.watsonForm.value;
      Object.keys(watson).forEach((key) => !watson[key] && delete watson[key]);
      this.http.post(Constant.API.SAVE_SETTINGS, { watson }).pipe(map((response: any) => {
        if (response.status === 200) {
          this.originData.watson = watson;
          this.showToast(1);
        } else {
          this.showToast(2);
        }
      })).subscribe();
    }
  }

  resetWatson(): void {
    this.watsonForm.patchValue(this.originData.watson);
  }

  showToast(index: number) {
    this.toastActiveIndex = index;
    this.toastSubject.next(0);
  }
}
