import R from 'ramda';


export const clearError = state => R.assoc('error', {}, state);
export const startLoading = state => R.assoc('loading', true, state);
export const successLoading = state => R.assoc('loading', true, state);
export const stopLoading = state => R.assoc('loading', false, state);
export const saveErrorMsg = (state, action, message) => R.assoc(
  'error',
  {
    message,
    error: action.error,
  },
  state);

export const startLoadingField = (state, field) => R.assoc(field, true, state);
export const successLoadingField = (state, field) => R.assoc(field, true, state);
export const stopLoadingField = (state, field) => R.assoc(field, false, state);
