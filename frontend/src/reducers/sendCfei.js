import { combineReducers } from 'redux';
import { sendCfei } from '../helpers/api/api';
import { errorToBeAdded } from './errorReducer';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../reducers/apiMeta';
import { loadCfei } from './cfeiDetails';


const errorMsg = 'Unable to send project';

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
      dispatch(loadEnded(SEND_CFEI));
      dispatch(loadSuccess(SEND_CFEI));
      dispatch(loadCfei(id));
      return response;
    })
    .catch((error) => {
      dispatch(loadEnded(SEND_CFEI));
      dispatch(loadFailure(SEND_CFEI, error));
      dispatch(errorToBeAdded(error, 'cfeiPublish', errorMsg));
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
