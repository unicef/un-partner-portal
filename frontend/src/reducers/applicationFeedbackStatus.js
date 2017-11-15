import R from 'ramda';

const messages = {
  loadingFailure: 'Couldn\'t load feedback for this application, ' +
  'please refresh page and try again',
};

export const CLEAR_APPLICATION_FEEDBACK_ERROR = 'CLEAR_APPLICATION_FEEDBACK_ERROR';
export const LOAD_APPLICATION_FEEDBACK_STARTED = 'LOAD_APPLICATION_FEEDBACK_STARTED';
export const LOAD_APPLICATION_FEEDBACK_ENDED = 'LOAD_APPLICATION_FEEDBACK_ENDED';
export const LOAD_APPLICATION_FEEDBACK_SUCCESS = 'LOAD_APPLICATION_FEEDBACK_SUCCESS';
export const LOAD_APPLICATION_FEEDBACK_FAILURE = 'LOAD_APPLICATION_FEEDBACK_FAILURE';

export const clearError = (state, action) => R.assocPath([action.key, 'error'], {}, state);
export const startLoading = (state, action) => R.assocPath([action.key, 'loading'], true, state);
export const successLoading = (state, action) => R.assocPath([action.key, 'loading'], true, state);
export const stopLoading = (state, action) => R.assocPath([action.key, 'loading'], false, state);
export const saveErrorMsg = (state, action) => R.assocPath([action.key,
  'error'],
{
  message: messages.loadingFailure,
  error: action.error.message || action.error.response.data,
},
state);

const initialState = {
  loading: {},
  error: {},
};


export const errorToBeCleared = () => ({ type: CLEAR_APPLICATION_FEEDBACK_ERROR });
export const loadApplicationFeedbackStarted = key =>
  ({ type: LOAD_APPLICATION_FEEDBACK_STARTED, key });
export const loadApplicationFeedbackEnded = key =>
  ({ type: LOAD_APPLICATION_FEEDBACK_ENDED, key });
export const loadApplicationFeedbackFailure = (error, key) => (
  { type: LOAD_APPLICATION_FEEDBACK_FAILURE, error, key });
export const loadApplicationFeedbackSuccess = (feedback, applicationId, count) => (
  { type: LOAD_APPLICATION_FEEDBACK_SUCCESS, feedback, applicationId, count });

export default function applicationStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_APPLICATION_FEEDBACK_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_APPLICATION_FEEDBACK_STARTED: {
      return startLoading(clearError(state, action), action);
    }
    case LOAD_APPLICATION_FEEDBACK_ENDED: {
      return stopLoading(state, action);
    }
    case CLEAR_APPLICATION_FEEDBACK_ERROR: {
      return clearError(state, action);
    }
    default:
      return state;
  }
}
