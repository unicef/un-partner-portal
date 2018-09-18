import { combineReducers } from 'redux';
import { deleteCfei } from '../helpers/api/api';
import { errorToBeAdded } from './errorReducer';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../reducers/apiMeta';

export const DELETE_CFEI = 'DELETE_CFEI';

const errorMsg = 'Unable to delete project';

const initialState = {
  submitting: false,
  processing: false,
  error: {},
};

export const deleteCfeiRequest = id => (dispatch) => {
  dispatch(loadStarted(DELETE_CFEI));
  return deleteCfei(id)
    .then((response) => {
      dispatch(loadEnded(DELETE_CFEI));
      dispatch(loadSuccess(DELETE_CFEI));
      return response;
    })
    .catch((error) => {
      dispatch(loadEnded(DELETE_CFEI));
      dispatch(loadFailure(DELETE_CFEI, error));
      dispatch(errorToBeAdded(error, 'cfeiDelete', errorMsg));
    });
};

function deleteCfeiReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${DELETE_CFEI}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: deleteCfeiReducer, status: apiMeta(DELETE_CFEI) });
