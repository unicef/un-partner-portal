import { combineReducers } from 'redux';
import { patchUserProfile } from '../helpers/api/api';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../reducers/apiMeta';
import { updateNotification } from '../reducers/session';

export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';

const initialState = {
  updateUserProfileSubmitting: false,
  updateUserProfileProcessing: false,
  error: {},
};

export const updateProfile = body => (dispatch) => {
  dispatch(loadStarted(UPDATE_USER_PROFILE));
  return patchUserProfile(body)
    .then((user) => {
      dispatch(loadEnded(UPDATE_USER_PROFILE));
      dispatch(loadSuccess(UPDATE_USER_PROFILE));
      dispatch(updateNotification(user));
      return user;
    })
    .catch((error) => {
      dispatch(loadEnded(UPDATE_USER_PROFILE));
      dispatch(loadFailure(UPDATE_USER_PROFILE, error));
      throw error;
    });
};

function updateUserProfileReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${UPDATE_USER_PROFILE}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: updateUserProfileReducer,
  status: apiMeta(UPDATE_USER_PROFILE) });
