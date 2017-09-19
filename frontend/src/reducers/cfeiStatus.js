import R from 'ramda';

export const CLEAR_ERROR = 'CLEAR_ERROR';
export const LOAD_CFEI_STARTED = 'LOAD_CFEI_STARTED';
export const LOAD_CFEI_ENDED = 'LOAD_CFEI_ENDED';
export const LOAD_CFEI_SUCCESS = 'LOAD_CFEI_SUCCESS';
export const LOAD_CFEI_FAILURE = 'LOAD_CFEI_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load Calls for Expression of ' +
  'Interests, please refresh page and try again',
};

const clearError = state => R.assoc('error', {}, state);
const startLoading = state => R.assoc('loading', true, state);
const stopLoading = state => R.assoc('loading', false, state);
const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error,
  },
  state);

export const errorToBeCleared = () => ({ type: CLEAR_ERROR });
export const loadCfeiStarted = () => ({ type: LOAD_CFEI_STARTED });
export const loadCfeiEnded = () => ({ type: LOAD_CFEI_ENDED });
export const loadCfeiSuccess = (cfei, project, getState) => (
  { type: LOAD_CFEI_SUCCESS, cfei, project, getState });
export const loadCfeiFailure = error => ({ type: LOAD_CFEI_FAILURE, error });

export default function cfeiStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_CFEI_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_CFEI_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_CFEI_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}
