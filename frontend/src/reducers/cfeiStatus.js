import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const CLEAR_CFEI_ERROR = 'CLEAR_CFEI_ERROR';
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

export const errorToBeCleared = () => ({ type: CLEAR_CFEI_ERROR });
export const loadCfeiStarted = () => ({ type: LOAD_CFEI_STARTED });
export const loadCfeiEnded = () => ({ type: LOAD_CFEI_ENDED });
export const loadCfeiSuccess = (cfei, project, count) => (
  { type: LOAD_CFEI_SUCCESS, cfei, project, count });
export const loadCfeiFailure = error => ({ type: LOAD_CFEI_FAILURE, error });

export default function cfeiStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_CFEI_FAILURE: {
      return saveErrorMsg(state, action, messages);
    }
    case LOAD_CFEI_STARTED: {
      return startLoading(clearError(state));
    }
    case LOAD_CFEI_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_CFEI_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}
