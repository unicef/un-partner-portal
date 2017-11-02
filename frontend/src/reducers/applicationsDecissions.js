import R from 'ramda';
import { getApplicationsDecissions } from '../helpers/api/api';
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
export const appDecLoadSuccess = response => ({ type: APP_DEC_LOAD_SUCCESS, response });
export const appDecLoadFailure = error => ({ type: APP_DEC_LOAD_FAILURE, error });
export const appDecLoadEnded = () => ({ type: APP_DEC_LOAD_ENDED });

const saveAppDec = (state, action) => {
  return action.response.results;
};

const messages = {
  loadFailed: 'Load application decissions failed.',
};

const initialState = [];

export const loadApplicationDecissions = params => (dispatch) => {
  dispatch(appDecLoadStarted());
  return getApplicationsDecissions(params)
    .then((cfei) => {
      dispatch(appDecLoadEnded());
      dispatch(appDecLoadSuccess(cfei));
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
