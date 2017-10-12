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
export const UPDATE_APPLICATION_PARTNER_NAME = 'UPDATE_APPLICATION_PARTNER_NAME';

export const loadApplicationSummary = (id, status, name) => (
  { type: LOAD_APPLICATION_SUMMARY, id, status, name });

export const updateApplicationPartnerName = (partnerName, id) => (
  { type: UPDATE_APPLICATION_PARTNER_NAME, partnerName, id });

export const loadApplication = id => (dispatch, getState) => {
  dispatch(loadApplicationDetailStarted());
  return getApplicationDetails(id)
    .then((application) => {
      dispatch(loadApplicationDetailEnded());
      dispatch(loadApplicationDetailSuccess(application, getState));
      return application;
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

const saveNewApplicationPartnerName = (state, action) => {
  const application = R.assoc(
    'partner_name',
    action.partnerName.legal_name,
    state[action.id]);
  return R.assoc(action.id, application, state);
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

export function selectApplicationProject(state, id) {
  return state[id] ? state[id].eoi : null;
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
    case UPDATE_APPLICATION_PARTNER_NAME: {
      return saveNewApplicationPartnerName(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ applicationDetails, status: applicationDetailsStatus });
