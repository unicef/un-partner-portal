import { combineReducers } from 'redux';
import { patchUser } from '../helpers/api/api';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../reducers/apiMeta';
import { loadCfei } from './cfeiDetails';

export const PUBLISH_DSR = 'PUBLISH_DSR';

const initialState = {
  newUserSubmitting: false,
  newUserProcessing: false,
  error: {},
};

export const publishDsr = id => (dispatch) => {
  dispatch(loadStarted(PUBLISH_DSR));
  return patchUser(id)
    .then((response) => {
      dispatch(loadEnded(PUBLISH_DSR));
      dispatch(loadSuccess(PUBLISH_DSR));
      dispatch(loadCfei(id));
      return response;
    })
    .catch((error) => {
      dispatch(loadEnded(PUBLISH_DSR));
      dispatch(loadFailure(PUBLISH_DSR, error));
      throw error;
    });
};

function publishDsrReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${PUBLISH_DSR}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: publishDsrReducer, status: apiMeta(PUBLISH_DSR) });
