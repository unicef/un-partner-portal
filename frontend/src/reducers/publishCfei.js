import { combineReducers } from 'redux';
import { publishCfei } from '../helpers/api/api';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../reducers/apiMeta';
import { loadCfei } from './cfeiDetails';

export const PUBLISH_CFEI = 'PUBLISH_CFEI';

const initialState = {
  publishSubmitting: false,
  publishProcessing: false,
  error: {},
};

export const publishCfeiRequest = id => (dispatch) => {
  dispatch(loadStarted(PUBLISH_CFEI));
  return publishCfei(id)
    .then((response) => {
      dispatch(loadEnded(PUBLISH_CFEI));
      dispatch(loadSuccess(PUBLISH_CFEI));
      dispatch(loadCfei(id));
      return response;
    })
    .catch((error) => {
      dispatch(loadEnded(PUBLISH_CFEI));
      dispatch(loadFailure(PUBLISH_CFEI, error));
      throw error;
    });
};

function publishCfeiReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${PUBLISH_CFEI}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: publishCfeiReducer, status: apiMeta(PUBLISH_CFEI) });
