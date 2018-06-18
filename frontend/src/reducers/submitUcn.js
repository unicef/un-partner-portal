import { combineReducers } from 'redux';
import { submitUcn } from '../helpers/api/api';
import { errorToBeAdded } from './errorReducer';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../reducers/apiMeta';
import { loadUnsolicitedCfei } from './cfeiDetails';

export const SUBMIT_UCN = 'SUBMIT_UCN';

const errorMsg = 'Unable to submit UCN';

const initialState = {
  submitting: false,
  processing: false,
  error: {},
};

export const submitUcnRequest = id => (dispatch) => {
  dispatch(loadStarted(SUBMIT_UCN));
  
  return submitUcn(id)
    .then((response) => {
      dispatch(loadEnded(SUBMIT_UCN));
      dispatch(loadSuccess(SUBMIT_UCN));
      dispatch(loadUnsolicitedCfei(id));
      return response;
    })
    .catch((error) => {
      dispatch(loadEnded(SUBMIT_UCN));
      dispatch(loadFailure(SUBMIT_UCN, error));
      dispatch(errorToBeAdded(error, 'submitUcn', errorMsg));
    });
};

function submitUcnReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${SUBMIT_UCN}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: submitUcnReducer, status: apiMeta(SUBMIT_UCN) });
