import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
} from './apiStatus';

export const CLEAR_APPLICATION_DETAIL_ERROR = 'CLEAR_APPLICATION_DETAIL_ERROR';
export const LOAD_APPLICATION_DETAIL_STARTED = 'LOAD_APPLICATION_DETAIL_STARTED';
export const LOAD_APPLICATION_DETAIL_ENDED = 'LOAD_APPLICATION_DETAIL_ENDED';
export const LOAD_APPLICATION_DETAIL_SUCCESS = 'LOAD_APPLICATION_DETAIL_SUCCESS';
export const LOAD_APPLICATION_DETAIL_FAILURE = 'LOAD_APPLICATION_DETAIL_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load details of this application, ' +
  'please refresh page and try again',
};

export const errorToBeCleared = () => ({ type: CLEAR_APPLICATION_DETAIL_ERROR });
export const loadApplicationDetailStarted = () => ({ type: LOAD_APPLICATION_DETAIL_STARTED });
export const loadApplicationDetailEnded = () => ({ type: LOAD_APPLICATION_DETAIL_ENDED });
export const loadApplicationDetailSuccess = (application, getState) => (
  { type: LOAD_APPLICATION_DETAIL_SUCCESS, application, getState });
export const loadApplicationDetailFailure = error => (
  { type: LOAD_APPLICATION_DETAIL_FAILURE, error });

export const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error,
  },
  state);


export default function applicationStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_APPLICATION_DETAIL_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_APPLICATION_DETAIL_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_APPLICATION_DETAIL_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_APPLICATION_DETAIL_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}
