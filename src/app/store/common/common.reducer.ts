import { createReducer, on } from '@ngrx/store';
import * as Actions from './common.actions';

export const initialCommonState = {};

export const commonReducer = createReducer(
  initialCommonState,
  on(Actions.saveStoreData, (state, { key, data }) => ({
    ...state,
    [key]: data
  })),
  on(Actions.resetStoreData, () => ({}))
);
