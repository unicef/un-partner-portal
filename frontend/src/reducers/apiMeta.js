import R from 'ramda';
/**
 * New reducer to handle async meta data.  
 */

export const success = (_, tag) => `LOAD_${tag}_SUCCESS`;
export const failure = (_, tag) => `LOAD_${tag}_FAILURE`;

const clearError = state => R.assoc('error', {}, state);
const startLoading = (state, action) =>
  R.merge(state, { loading: true, cancelToken: action.cancelToken });
const stopLoading = state =>
  R.merge(state, { loading: false, cancelToken: null });
const saveError = (state, action) => R.assoc(
  'error',
  action.error || R.path(['error', 'message'], action),
  state);

const initialState = {
  loading: false,
  cancelToken: null,
  error: null,
};

export const errorToBeCleared = tag => ({ type: `CLEAR_${tag}_ERROR` });
export const loadStarted = (tag, cancelToken) =>
  ({ type: `LOAD_${tag}_STARTED`, cancelToken });
export const loadEnded = tag => ({ type: `LOAD_${tag}_ENDED` });
export const loadSuccess = (tag, params) =>
  ({ type: `LOAD_${tag}_SUCCESS`, ...params });
export const loadFailure = (tag, error) => (
  { type: `LOAD_${tag}_FAILURE`, error });

export default function createMetaReducer(tag) {
  return function apiMetaReducer(state = { ...initialState }, action) {
    switch (action.type) {
      case `LOAD_${tag}_FAILURE`: {
        return saveError(state, action);
      }
      case `LOAD_${tag}_STARTED`: {
        return startLoading(clearError(state), action);
      }
      case `LOAD_${tag}_ENDED`: {
        return stopLoading(state);
      }
      case `CLEAR_${tag}_ERROR`: {
        return clearError(state);
      }
      default:
        return state;
    }
  };
}
