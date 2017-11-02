import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';
import { convertCnToDirectSelection } from '../helpers/api/api';
import { loadUnsolicitedCfei } from '../reducers/cfeiDetails';

export const CONVERT_CN_STARTED = 'CONVERT_CN_STARTED';
export const CONVERT_CN_SUCCESS = 'CONVERT_CN_SUCCESS';
export const CONVERT_CN_FAILURE = 'CONVERT_CN_FAILURE';
export const CONVERT_CN_ENDED = 'CONVERT_CN_ENDED';

export const convertCnStarted = () => ({ type: CONVERT_CN_STARTED });
export const convertCnSuccess = response => ({ type: CONVERT_CN_SUCCESS, response });
export const convertCnFailure = error => ({ type: CONVERT_CN_FAILURE, error });
export const convertCnEnded = () => ({ type: CONVERT_CN_ENDED });

export const convertCnToDS = (body, cnId) => (dispatch) => {
  dispatch(convertCnStarted());

  return convertCnToDirectSelection(body, cnId)
    .then((profiles) => {
      dispatch(convertCnEnded());
      dispatch(convertCnSuccess(profiles));
      dispatch(loadUnsolicitedCfei(cnId));
    })
    .catch((error) => {
      dispatch(convertCnEnded());
      dispatch(convertCnFailure(error));
    });
};

const messages = {
  convertFailed: 'Converting concept notes failed.',
};

const initialState = {
  loading: false,
  error: { },
};

export default function conceptNoteReducer(state = initialState, action) {
  switch (action.type) {
    case CONVERT_CN_FAILURE: {
      return saveErrorMsg(state, action, messages.uploadFailed);
    }
    case CONVERT_CN_ENDED: {
      return stopLoading(state);
    }
    case CONVERT_CN_STARTED: {
      return startLoading(clearError(state));
    }
    default:
      return state;
  }
}
