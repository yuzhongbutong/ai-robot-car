import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { AppRoutingModule } from './app-routing.module';
import { commonReducer } from 'src/store/reducer/app.reducer';
import { AppInterceptor } from 'src/utils/app.interceptor';
import { AppComponent } from './app.component';
import { LoginComponent } from './login.component/login.component';
import { MainComponent } from './main.component/main.component';
import { IntroductionComponent } from './main.component/introduction.component/introduction.component';
import { SettingsComponent } from './main.component/settings.component/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    IntroductionComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    StoreModule.forRoot({ common: commonReducer })
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }
}
