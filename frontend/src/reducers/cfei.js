import R from 'ramda';
import { getOpenCfei, getPinnedCfei } from '../helpers/api/api';

export const LOAD_CFEI_STARTED = 'LOAD_CFEI_STARTED';
export const LOAD_CFEI_ENDED = 'LOAD_CFEI_ENDED';
export const LOAD_CFEI_SUCCESS = 'LOAD_CFEI_SUCCESS';
export const LOAD_CFEI_FAILURE = 'LOAD_CFEI_FAILURE';

const messages = {
  loadingFailure: 'Couldn\'t load Calls for Expression of ' +
  'Interests, please refresh page and try again',
};

const initialState = {
  cfei: [],
  loading: false,
  error: {},
};

const loadCfeiStarted = () => ({ type: LOAD_CFEI_STARTED });
const loadCfeiEnded = () => ({ type: LOAD_CFEI_ENDED });
const loadCfeiSuccess = cfei => ({ type: LOAD_CFEI_SUCCESS, cfei });
const loadCfeiFailure = error => ({ type: LOAD_CFEI_FAILURE, error });

export const loadOpenCfei = (dispatch) => {
  dispatch(loadCfeiStarted());
  getOpenCfei()
    .then((cfei) => {
      dispatch(loadCfeiEnded());
      dispatch(loadCfeiSuccess(cfei.results));
    })
    .catch((error) => {
      dispatch(loadCfeiEnded());
      dispatch(loadCfeiFailure(error));
    });
};

export const loadPinnedCfei = (dispatch) => {
  dispatch(loadCfeiStarted());
  getPinnedCfei()
    .then((cfei) => {
      dispatch(loadCfeiEnded());
      dispatch(loadCfeiSuccess(cfei.results));
    })
    .catch((error) => {
      dispatch(loadCfeiEnded());
      dispatch(loadCfeiFailure(error));
    });
};

const startLoading = state => R.assoc('error', {}, R.assoc('loading', true, state));
const stopLoading = state => R.assoc('loading', false, state);
const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error,
  },
  state);
const saveCfei = (state, action) => R.assoc('cfei', action.cfei, state);


export default function CfeiReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_CFEI_SUCCESS: {
      return saveCfei(state, action);
    }
    case LOAD_CFEI_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_CFEI_STARTED: {
      return startLoading(state);
    }
    case LOAD_CFEI_ENDED: {
      return stopLoading(state);
    }
    default:
      return state;
  }
}
