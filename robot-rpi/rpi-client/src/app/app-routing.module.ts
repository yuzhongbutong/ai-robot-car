import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/utils/auth.guard';
import { LoginComponent } from './login.component/login.component';
import { MainComponent } from './main.component/main.component';
import { IntroductionComponent } from './main.component/introduction.component/introduction.component';
import { SettingsComponent } from './main.component/settings.component/settings.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'introduction',
        component: IntroductionComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: '**',
        redirectTo: 'introduction'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
