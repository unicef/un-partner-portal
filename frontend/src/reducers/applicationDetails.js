import { combineReducers } from 'redux';
import R from 'ramda';
import applicationDetailsStatus, {
  loadApplicationDetailStarted,
  loadApplicationDetailEnded,
  loadApplicationDetailSuccess,
  loadApplicationDetailFailure,
  LOAD_APPLICATION_DETAIL_SUCCESS,
} from './applicationDetailsStatus';
import { selectPartnerName } from '../store';

import { getApplicationDetails } from '../helpers/api/api';

const initialState = {};
export const LOAD_APPLICATION_SUMMARY = 'LOAD_APPLICATION_SUMMARY';

export const loadApplicationSummary = (id, status, name) => (
  { type: LOAD_APPLICATION_SUMMARY, id, status, name });

export const loadApplication = id => (dispatch, getState) => {
  dispatch(loadApplicationDetailStarted());
  return getApplicationDetails(id)
    .then((application) => {
      dispatch(loadApplicationDetailEnded());
      dispatch(loadApplicationDetailSuccess(application, getState));
    })
    .catch((error) => {
      dispatch(loadApplicationDetailEnded());
      dispatch(loadApplicationDetailFailure(error));
    });
};

const saveApplication = (state, action) => {
  const application = R.assoc(
    'partner_name',
    selectPartnerName(
      action.getState(),
      action.application.id,
    ),
    action.application);
  return R.assoc(application.id, application, state);
};

export function selectApplication(state, id) {
  return state[id] ? state[id] : null;
}

export function selectApplicationStatus(state, id) {
  return state[id] ? state[id].status : '';
}

export function selectApplicationPartnerName(state, id) {
  return state[id] ? state[id].partner_name : '';
}

const saveApplicationSync = (state, action) => {
  if (selectApplication(state, action.id)) return state;
  const { id, name, status } = action;
  return R.assoc(
    id,
    { id, status, partner_name: name },
    state);
};

const applicationDetails = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_APPLICATION_DETAIL_SUCCESS: {
      return saveApplication(state, action);
    }
    case LOAD_APPLICATION_SUMMARY: {
      return saveApplicationSync(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ applicationDetails, status: applicationDetailsStatus });
