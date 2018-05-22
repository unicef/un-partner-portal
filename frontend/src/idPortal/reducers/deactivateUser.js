import { combineReducers } from 'redux';
import { patchUser } from '../../helpers/api/api';
import { loadUsersList } from '../reducers/usersList';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../../reducers/apiMeta';

export const DEACTIVATE_USER = 'DEACTIVATE_USER';

const initialState = {
  newUserSubmitting: false,
  newUserProcessing: false,
  error: {},
};

export const deactivateUser = id => (dispatch, getState) => {
  const body = {
    is_active: false,
  };

  dispatch(loadStarted(DEACTIVATE_USER));

  return patchUser(id, body)
    .then((user) => {
      dispatch(loadEnded(DEACTIVATE_USER));
      dispatch(loadSuccess(DEACTIVATE_USER));
      dispatch(loadUsersList());
      return user;
    })
    .catch((error) => {
      dispatch(loadEnded(DEACTIVATE_USER));
      dispatch(loadFailure(DEACTIVATE_USER, error));
      throw error;
    });
};


function userDeactivateReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${DEACTIVATE_USER}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: userDeactivateReducer, status: apiMeta(DEACTIVATE_USER) });
