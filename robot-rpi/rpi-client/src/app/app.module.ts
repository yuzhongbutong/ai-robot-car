import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { commonReducer } from 'src/store/reducer/app.reducer';
import { LoginComponent } from './login.component/login.component';
import { SettingsComponent } from './settings.component/settings.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.addIconPacks(fas, far, fab);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule,
    StoreModule.forRoot({ common: commonReducer })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
