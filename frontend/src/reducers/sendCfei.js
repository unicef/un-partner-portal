import { combineReducers } from 'redux';
import { sendCfei } from '../helpers/api/api';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../reducers/apiMeta';
import { loadCfei } from './cfeiDetails';

export const SEND_CFEI = 'SEND_CFEI';

const initialState = {
  submitting: false,
  processing: false,
  error: {},
};

export const sendCfeiRequest = id => (dispatch) => {
  dispatch(loadStarted(SEND_CFEI));
  return sendCfei(id)
    .then((response) => {
      debugger;
      dispatch(loadEnded(SEND_CFEI));
      dispatch(loadSuccess(SEND_CFEI));
      dispatch(loadCfei(id));
      return response;
    })
    .catch((error) => {
      dispatch(loadEnded(SEND_CFEI));
      dispatch(loadFailure(SEND_CFEI, error));
      throw error;
    });
};

function sendCfeiReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${SEND_CFEI}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: sendCfeiReducer, status: apiMeta(SEND_CFEI) });
