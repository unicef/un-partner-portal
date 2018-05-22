import { combineReducers } from 'redux';
import { patchUser } from '../../helpers/api/api';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../../reducers/apiMeta';

export const PATCH_USER = 'PATCH_USER';

const initialState = {
  newUserSubmitting: false,
  newUserProcessing: false,
  error: {},
};

export const editUser = (id, body) => (dispatch, getState) => {
  dispatch(loadStarted(PATCH_USER));
  return patchUser(id, body)
    .then((user) => {
      dispatch(loadEnded(PATCH_USER));
      dispatch(loadSuccess(PATCH_USER));
      return user;
    })
    .catch((error) => {
      dispatch(loadEnded(PATCH_USER));
      dispatch(loadFailure(PATCH_USER, error));
      throw error;
    });
};

function userPatchReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${PATCH_USER}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: userPatchReducer, status: apiMeta(PATCH_USER) });
