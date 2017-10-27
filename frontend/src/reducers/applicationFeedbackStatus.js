import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
} from './apiStatus';

export const CLEAR_APPLICATION_FEEDBACK_ERROR = 'CLEAR_APPLICATION_FEEDBACK_ERROR';
export const LOAD_APPLICATION_FEEDBACK_STARTED = 'LOAD_APPLICATION_FEEDBACK_STARTED';
export const LOAD_APPLICATION_FEEDBACK_ENDED = 'LOAD_APPLICATION_FEEDBACK_ENDED';
export const LOAD_APPLICATION_FEEDBACK_SUCCESS = 'LOAD_APPLICATION_FEEDBACK_SUCCESS';
export const LOAD_APPLICATION_FEEDBACK_FAILURE = 'LOAD_APPLICATION_FEEDBACK_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load feedback for this application, ' +
  'please refresh page and try again',
};

export const errorToBeCleared = () => ({ type: CLEAR_APPLICATION_FEEDBACK_ERROR });
export const loadApplicationFeedbackStarted = () => ({ type: LOAD_APPLICATION_FEEDBACK_STARTED });
export const loadApplicationFeedbackEnded = () => ({ type: LOAD_APPLICATION_FEEDBACK_ENDED });
export const loadApplicationFeedbackSuccess = (feedback, applicationId, count) => (
  { type: LOAD_APPLICATION_FEEDBACK_SUCCESS, feedback, applicationId, count });
export const loadApplicationFeedbackFailure = error => (
  { type: LOAD_APPLICATION_FEEDBACK_FAILURE, error });

export const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error.message || action.error.response.data,
  },
  state);


export default function applicationStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_APPLICATION_FEEDBACK_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_APPLICATION_FEEDBACK_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_APPLICATION_FEEDBACK_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_APPLICATION_FEEDBACK_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}
