import { combineReducers } from 'redux';
import { sendForDecision } from '../helpers/api/api';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from './apiMeta';
import { loadCfei } from './cfeiDetails';

export const SEND_CFEI_FOR_DECISION = 'SEND_CFEI_FOR_DECISION';

const initialState = {
  error: {},
};

export const sendCfeiForDecision = id => (dispatch) => {
  dispatch(loadStarted(SEND_CFEI_FOR_DECISION));
  return sendForDecision(id)
    .then((number) => {
      dispatch(loadEnded(SEND_CFEI_FOR_DECISION));
      dispatch(loadSuccess(SEND_CFEI_FOR_DECISION));
      dispatch(loadCfei(id));
      return number;
    })
    .catch((error) => {
      dispatch(loadEnded(SEND_CFEI_FOR_DECISION));
      dispatch(loadFailure(SEND_CFEI_FOR_DECISION, error));
      throw error;
    });
};

function sendCfeiForDecisionReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${SEND_CFEI_FOR_DECISION}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: sendCfeiForDecisionReducer,
  status: apiMeta(SEND_CFEI_FOR_DECISION) });
