import { combineReducers } from 'redux';
import { deleteUcn } from '../helpers/api/api';
import { errorToBeAdded } from './errorReducer';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../reducers/apiMeta';

export const DELETE_UCN = 'DELETE_UCN';

const errorMsg = 'Unable to delete UCN';

const initialState = {
  submitting: false,
  processing: false,
  error: {},
};

export const deleteUcnRequest = id => (dispatch) => {
  dispatch(loadStarted(DELETE_UCN));
  return deleteUcn(id)
    .then((response) => {
      dispatch(loadEnded(DELETE_UCN));
      dispatch(loadSuccess(DELETE_UCN));
      return response;
    })
    .catch((error) => {
      dispatch(loadEnded(DELETE_UCN));
      dispatch(loadFailure(DELETE_UCN, error));
      dispatch(errorToBeAdded(error, 'ucnDelete', errorMsg));
    });
};

function deleteUcnReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${DELETE_UCN}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: deleteUcnReducer, status: apiMeta(DELETE_UCN) });
