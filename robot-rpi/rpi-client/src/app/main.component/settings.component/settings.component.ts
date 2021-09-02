import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Constant } from 'src/utils/constant';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  tapActiveIndex = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.http.post(Constant.API.QUERY_SETTINGS, {}).pipe(map((response: any) => {
    //   console.log(response)
    // })).subscribe();
    // this.http.post(Constant.API.SAVE_SETTINGS, {'mqtt-local': {host: '192.168.3.12', port: 1883}}).pipe(map((response: any) => {
    //   console.log(response)
    // })).subscribe();
  }
}
