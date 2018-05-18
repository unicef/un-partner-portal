import { combineReducers } from 'redux';
import { postNewUser } from '../../helpers/api/api';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../../reducers/apiMeta';

export const NEW_USER = 'NEW_USER';

const initialState = {
  newUserSubmitting: false,
  newUserProcessing: false,
  error: {},
};

export const addNewUser = body => (dispatch, getState) => {
  dispatch(loadStarted(NEW_USER));
  return postNewUser(body)
    .then((user) => {
      dispatch(loadEnded(NEW_USER));
      dispatch(loadSuccess(NEW_USER));
      return user;
    })
    .catch((error) => {
      dispatch(loadEnded(NEW_USER));
      dispatch(loadFailure(NEW_USER, error));
      throw error;
    });
};

function userReducer(state = initialState, action) {
  console.log('ACTION', action);
  switch (action && action.type) {
    case success`${NEW_USER}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: userReducer, status: apiMeta(NEW_USER) });
