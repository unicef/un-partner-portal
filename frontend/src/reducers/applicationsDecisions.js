import R from 'ramda';
import { getApplicationsDecisions } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const APP_DEC_LOAD_STARTED = 'APP_DEC_LOAD_STARTED';
export const APP_DEC_LOAD_SUCCESS = 'APP_DEC_LOAD_SUCCESS';
export const APP_DEC_LOAD_FAILURE = 'APP_DEC_LOAD_FAILURE';
export const APP_DEC_LOAD_ENDED = 'APP_DEC_LOAD_ENDED';

export const appDecLoadStarted = () => ({ type: APP_DEC_LOAD_STARTED });
export const appDecLoadSuccess = (results, count) =>
  ({ type: APP_DEC_LOAD_SUCCESS, results, count });
export const appDecLoadFailure = error => ({ type: APP_DEC_LOAD_FAILURE, error });
export const appDecLoadEnded = () => ({ type: APP_DEC_LOAD_ENDED });

const saveAppDec = (state, action) => {
  return R.merge(state, { decisions: action.results, count: action.count });
};

const messages = {
  loadFailed: 'Load application decissions failed.',
};

const initialState = {
  loading: false,
  error: null,
  count: 0,
  decisions: [],
};

export const loadApplicationDecisions = params => (dispatch) => {
  dispatch(appDecLoadStarted());
  return getApplicationsDecisions(params)
    .then(({ results, count }) => {
      dispatch(appDecLoadEnded());
      dispatch(appDecLoadSuccess(results, count));
    })
    .catch((error) => {
      dispatch(appDecLoadEnded());
      dispatch(appDecLoadFailure(error));
    });
};

export default function applicationDecissionsReducer(state = initialState, action) {
  switch (action.type) {
    case APP_DEC_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case APP_DEC_LOAD_ENDED: {
      return stopLoading(state);
    }
    case APP_DEC_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    case APP_DEC_LOAD_SUCCESS: {
      return saveAppDec(state, action);
    }
    default:
      return state;
  }
}
