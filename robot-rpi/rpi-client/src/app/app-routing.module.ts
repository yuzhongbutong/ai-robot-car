import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/utils/auth.guard';
import { LoginComponent } from './login.component/login.component';
import { MainComponent } from './main.component/main.component';
import { MenuComponent } from './menu.component.old/menu.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard]
  },


  {
    path: 'menu',
    component: MenuComponent
  }


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
