import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
} from './apiStatus';

export const CLEAR_APPLICATION_LIST_ERROR = 'CLEAR_APPLICATION_LIST_ERROR';
export const LOAD_APPLICATION_LIST_STARTED = 'LOAD_APPLICATION_LIST_STARTED';
export const LOAD_APPLICATION_LIST_ENDED = 'LOAD_APPLICATION_LIST_ENDED';
export const LOAD_APPLICATION_LIST_SUCCESS = 'LOAD_APPLICATION_LIST_SUCCESS';
export const LOAD_APPLICATION_LIST_FAILURE = 'LOAD_APPLICATION_LIST_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load applications for this project, ' +
  'please refresh page and try again',
};

export const errorToBeCleared = () => ({ type: CLEAR_APPLICATION_LIST_ERROR });
export const loadApplicationListStarted = () => ({ type: LOAD_APPLICATION_LIST_STARTED });
export const loadApplicationListEnded = () => ({ type: LOAD_APPLICATION_LIST_ENDED });
export const loadApplicationListSuccess = applications => (
  { type: LOAD_APPLICATION_LIST_SUCCESS, applications });
export const loadApplicationListFailure = error => ({ type: LOAD_APPLICATION_LIST_FAILURE, error });

export const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error,
  },
  state);


export default function applicationListStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_APPLICATION_LIST_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_APPLICATION_LIST_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_APPLICATION_LIST_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_APPLICATION_LIST_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}
