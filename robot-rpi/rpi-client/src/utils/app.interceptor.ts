import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonState } from 'src/store/model/app.model';
import { setLoading } from 'src/store/actions/app.actions';
import { finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    constructor(private store: Store<{ common: CommonState }>, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        Promise.resolve(null).then(() => this.store.dispatch(setLoading({ loading: true })));
        const token: string = sessionStorage.getItem('token') || '';
        req = req.clone({
            headers: req.headers.set('Authorization', token)
        });
        return next.handle(req).pipe(
            tap((event: any) => {
                if (event.status >= 500) {
                    // Todo
                }
            }, (error: any) => {
                if (error.status === 401) {
                    sessionStorage.removeItem('token');
                    this.router.navigate(['login']);
                }
            }),
            finalize(() => {
                this.store.dispatch(setLoading({ loading: false }));
            })
        );
    }
}
