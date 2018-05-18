import R from 'ramda';
import { getUsersList } from '../../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from '../../reducers/apiStatus';

export const USERS_LOAD_STARTED = 'USERS_LOAD_STARTED';
export const USERS_LOAD_SUCCESS = 'USERS_LOAD_SUCCESS';
export const USERS_LOAD_FAILURE = 'USERS_LOAD_FAILURE';
export const USERS_LOAD_ENDED = 'USERS_LOAD_ENDED';

export const usersLoadStarted = () => ({ type: USERS_LOAD_STARTED });
export const usersLoadSuccess = response => ({ type: USERS_LOAD_SUCCESS, response });
export const usersLoadFailure = error => ({ type: USERS_LOAD_FAILURE, error });
export const usersLoadEnded = () => ({ type: USERS_LOAD_ENDED });

const saveUsers = (state, action) => {
  const users = R.assoc('users', action.response.results, state);
  return R.assoc('totalCount', action.response.count, users);
};

const messages = {
  loadFailed: 'Loading users failed.',
};

const initialState = {
  columns: [
    { name: 'name', title: 'Name' },
    // { name: 'office_name', title: 'Office' },
    // { name: 'role', title: 'Role' },
    { name: 'email', title: 'E-mail' },
    { name: 'status', title: 'Status' },
  ],
  loading: false,
  totalCount: 0,
  users: [],
};


export const loadUsersList = (agencyId, params) => (dispatch) => {
  dispatch(usersLoadStarted());
  return getUsersList(agencyId, params)
    .then((users) => {
      dispatch(usersLoadEnded());
      dispatch(usersLoadSuccess(users));
    })
    .catch((error) => {
      dispatch(usersLoadEnded());
      dispatch(usersLoadFailure(error));
    });
};

export default function agencyUsersListReducer(state = initialState, action) {
  switch (action.type) {
    case USERS_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case USERS_LOAD_ENDED: {
      return stopLoading(state);
    }
    case USERS_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    case USERS_LOAD_SUCCESS: {
      return saveUsers(state, action);
    }
    default:
      return state;
  }
}
