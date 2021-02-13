import { Action, createReducer, on } from '@ngrx/store';
import { setLoading } from '../actions/app.actions';
import { CommonState, initCommonState } from '../model/app.model';

const $commonReducer = createReducer(
    initCommonState,
    on(setLoading, (state, props) => ({ ...state, ...props }))
);

export const commonReducer = (state: CommonState | undefined, action: Action) => {
    return $commonReducer(state, action);
};
