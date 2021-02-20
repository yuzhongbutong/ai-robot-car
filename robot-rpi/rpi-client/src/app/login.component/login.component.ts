import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Constant } from 'src/utils/constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = 'pi';
  password = 'raspberry';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) { }

  doSubmit(): void {
    const params = {
      username: this.username,
      password: this.password
    };
    this.http.post(Constant.API.LOGIN, params).pipe(
      map((response: any) => {
        const { status, data: { token } } = response;
        if (status === 200) {
          sessionStorage.setItem('token', token);
          this.router.navigate(['']);
        }
      }),
      catchError((error: any) => {
        this.errorMessage = error.message;
        return throwError(error);
      })
    ).subscribe();
  }
}
