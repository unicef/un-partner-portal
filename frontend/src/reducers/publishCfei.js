import { combineReducers } from 'redux';
import { publishCfei } from '../helpers/api/api';
import { errorToBeAdded } from './errorReducer';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../reducers/apiMeta';
import { loadCfei } from './cfeiDetails';

export const PUBLISH_CFEI = 'PUBLISH_CFEI';

const errorMsg = 'Unable to publish project';

const initialState = {
  submitting: false,
  processing: false,
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
      dispatch(errorToBeAdded(error, 'cfeiPublish', errorMsg));
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
