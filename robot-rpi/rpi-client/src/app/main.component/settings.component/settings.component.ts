import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Constant } from 'src/utils/constant';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  tapActiveIndex = 0;
  toastActiveIndex = 0;
  internalForm: FormGroup = new FormGroup({
    mqttUrl: new FormControl('', [
      Validators.required,
      Validators.maxLength(100)
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
      Validators.maxLength(100)
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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.post(Constant.API.QUERY_SETTINGS, {}).pipe(map((response: any) => {
      this.originData = response.data;
      const { internal, watson } = response.data;
      this.internalForm.patchValue(internal);
      this.watsonForm.patchValue(watson);
    })).subscribe();
  }

  saveInternal(): void {
    if (this.internalForm.valid) {
      const internal = this.internalForm.value;
      Object.keys(internal).forEach((key) => !internal[key] && delete internal[key]);
      this.http.post(Constant.API.SAVE_SETTINGS, { internal }).pipe(map((response: any) => {
        if (response) {
          this.originData.internal = internal;
          this.closeToast(1);
        } else {
          this.closeToast(2);
        }
      })).subscribe();
    }
  }

  resetInternal(): void {
    this.internalForm.patchValue(this.originData.internal);
  }

  saveWatson(): void {
    if (this.watsonForm.valid) {
      const watson = this.watsonForm.value;
      Object.keys(watson).forEach((key) => !watson[key] && delete watson[key]);
      this.http.post(Constant.API.SAVE_SETTINGS, { watson }).pipe(map((response: any) => {
        if (response) {
          this.originData.watson = watson;
          this.closeToast(1);
        } else {
          this.closeToast(2);
        }
      })).subscribe();
    }
  }

  resetWatson(): void {
    this.watsonForm.patchValue(this.originData.watson);
  }

  closeToast(index: number) {
    this.toastActiveIndex = index;
    of(0).pipe(delay(2000)).subscribe(() => this.toastActiveIndex = 0);
  }
}
