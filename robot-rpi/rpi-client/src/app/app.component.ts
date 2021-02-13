import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setLoading } from 'src/store/actions/app.actions';
import { CommonState } from 'src/store/model/app.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading$: Observable<boolean>;

  constructor(private store: Store<{ common: CommonState }>) {
    this.loading$ = this.store.select(state => state.common.loading);
  }

  setLoading(loading: boolean): void {
    this.store.dispatch(setLoading({loading}));
  }
}
