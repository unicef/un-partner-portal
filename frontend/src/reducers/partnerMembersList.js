import R from 'ramda';
import { getPartnerMembersList } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const MEMBERS_LOAD_STARTED = 'MEMBERS_LOAD_STARTED';
export const MEMBERS_LOAD_SUCCESS = 'MEMBERS_LOAD_SUCCESS';
export const MEMBERS_LOAD_FAILURE = 'MEMBERS_LOAD_FAILURE';
export const MEMBERS_LOAD_ENDED = 'MEMBERS_LOAD_ENDED';

export const membersLoadStarted = () => ({ type: MEMBERS_LOAD_STARTED });
export const membersLoadSuccess = response => ({ type: MEMBERS_LOAD_SUCCESS, response });
export const membersLoadFailure = error => ({ type: MEMBERS_LOAD_FAILURE, error });
export const membersLoadEnded = () => ({ type: MEMBERS_LOAD_ENDED });

const saveMembers = (state, action) => {
  const members = R.assoc('items', action.response.results, state);
  return R.assoc('totalCount', action.response.count, members);
};

const messages = {
  loadFailed: 'Load members failed.',
};

const initialState = {
  columns: [
    { name: 'name', title: 'Name' },
    { name: 'title', title: 'Title' },
    { name: 'role', title: 'Role' },
    { name: 'email', title: 'E-mail' },
  ],
  loading: false,
  totalCount: 0,
  items: [],
};

export const loadMembersList = (partnerId, params, options) => (dispatch) => {
  dispatch(membersLoadStarted());
  return getPartnerMembersList(partnerId, params, options)
    .then((members) => {
      dispatch(membersLoadEnded());
      dispatch(membersLoadSuccess(members));
    })
    .catch((error) => {
      dispatch(membersLoadEnded());
      dispatch(membersLoadFailure(error));
    });
};

export default function agencyMembersListReducer(state = initialState, action) {
  switch (action.type) {
    case MEMBERS_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case MEMBERS_LOAD_ENDED: {
      return stopLoading(state);
    }
    case MEMBERS_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    case MEMBERS_LOAD_SUCCESS: {
      return saveMembers(state, action);
    }
    default:
      return state;
  }
}
