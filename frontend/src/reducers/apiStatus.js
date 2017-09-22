import R from 'ramda';

export const clearError = state => R.assoc('error', {}, state);
export const startLoading = state => R.assoc('loading', true, state);
export const stopLoading = state => R.assoc('loading', false, state);
export const saveErrorMsg = (state, action, message) => R.assoc(
  'error',
  {
    message,
    error: action.error,
  },
  state);

