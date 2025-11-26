import { createAction, props } from '@ngrx/store';

export const saveStoreData = createAction(
  '[Common] Save Data',
  props<{ key: string; data: any }>()
);

export const resetStoreData = createAction(
  '[Common] Reset Data');
