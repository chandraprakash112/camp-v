import { createFeatureSelector, createSelector } from '@ngrx/store';

export const SELECTOR = {
  APP_CONFIG: 'appConfig',
  ASSIGN_USERS: 'assignUsers',
  BUSINESS_UNITS: 'businessUnits',
  DEPARTMENT: 'department',
  CATEGORY: 'category',
  BINS: 'bins',
  CREATED_USERS: 'createdUser',
  USERS: 'Users',
  PROFILE: 'profile',
  ROLES: 'roles',
  SEVERITY: 'severity',
  STATUS: 'status',
  LOCATION: 'location',
  ROLE_TYPE: 'roleType',
  PERSONA: 'persona'
}

export const selectCommonState = createFeatureSelector<any>('common');

export const getStoreData = (key: string) =>
  createSelector(selectCommonState, (state: any) => state[key]);
