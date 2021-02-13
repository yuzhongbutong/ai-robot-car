import { createAction, props } from '@ngrx/store';

export const setLoading = createAction('[COMMON] Set Loading', props<{ loading: boolean }>());
