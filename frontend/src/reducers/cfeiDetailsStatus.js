import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const CLEAR_CFEI_DETAIL_ERROR = 'CLEAR_CFEI_DETAIL_ERROR';
export const LOAD_CFEI_DETAIL_STARTED = 'LOAD_CFEI_DETAIL_STARTED';
export const LOAD_CFEI_DETAIL_ENDED = 'LOAD_CFEI_DETAIL_ENDED';
export const LOAD_CFEI_DETAIL_SUCCESS = 'LOAD_CFEI_DETAIL_SUCCESS';
export const LOAD_CFEI_DETAIL_FAILURE = 'LOAD_CFEI_DETAIL_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load details of this project, ' +
  'please refresh page and try again',
};

export const errorToBeCleared = () => ({ type: CLEAR_CFEI_DETAIL_ERROR });
export const loadCfeiDetailStarted = () => ({ type: LOAD_CFEI_DETAIL_STARTED });
export const loadCfeiDetailEnded = () => ({ type: LOAD_CFEI_DETAIL_ENDED });
export const loadCfeiDetailSuccess = (cfei, project, getState) => (
  { type: LOAD_CFEI_DETAIL_SUCCESS, cfei, project, getState });
export const loadCfeiDetailFailure = error => ({ type: LOAD_CFEI_DETAIL_FAILURE, error });

export default function cfeiStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_CFEI_DETAIL_FAILURE: {
      return saveErrorMsg(state, action, messages);
    }
    case LOAD_CFEI_DETAIL_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_CFEI_DETAIL_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_CFEI_DETAIL_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}
