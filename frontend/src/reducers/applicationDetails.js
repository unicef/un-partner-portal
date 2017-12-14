import { combineReducers } from 'redux';
import R from 'ramda';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, {
  success,
  loadSuccess,
} from './apiMeta';
import { errorToBeAdded } from './errorReducer';

import { getApplicationDetails, patchApplication } from '../helpers/api/api';

const errorMessage = 'Couldn\'t load details of this application, please refresh page and try again';
const updateErrorMessage = 'Couldn\'t update application, please try again';

export const APPLICATION_DETAILS = 'APPLICATION_DETAILS';
const tag = 'applicationDetails';

const initialState = {};

export const UPDATE_APPLICATION_PARTNER_NAME = 'UPDATE_APPLICATION_PARTNER_NAME';

export const loadApplication = id => sendRequest({
  loadFunction: getApplicationDetails,
  meta: {
    reducerTag: tag,
    actionTag: APPLICATION_DETAILS,
    isPaginated: false,
  },
  errorHandling: { userMessage: errorMessage },
  apiParams: [id],
});

export const updateApplication = (applicationId, body) => (dispatch, getState) =>
  patchApplication(applicationId, body)
    .then((application) => {
      dispatch(loadSuccess(APPLICATION_DETAILS, { results: application, getState }));
      return application;
    }).catch((error) => {
      dispatch(errorToBeAdded(error, 'applicationUpdate', updateErrorMessage));
    });

const saveApplication = (state, action) =>
  R.assoc(action.results.id, R.mergeDeepRight(state[action.results.id], action.results), state);

export function selectApplication(state, id) {
  return state[id] ? state[id] : null;
}

export function selectApplicationStatus(state, id) {
  return state[id] ? state[id].status : '';
}

export function selectApplicationPartnerName(state, id) {
  return state[id] ? state[id].partner.legal_name : '';
}

export function selectApplicationProject(state, id) {
  return state[id] ? state[id].eoi : null;
}

export function selectApplicationWithdrawStatus(state, id) {
  const { [id]: { withdraw_reason = null, did_withdraw = false } = {} } = state;
  return { withdraw_reason, did_withdraw };
}

export function selectApplicationCurrentStatus(state, id) {
  const { [id]: { application_status = null } = {} } = state;
  return application_status;
}

const applicationDetails = (state = initialState, action) => {
  switch (action.type) {
    case success`${APPLICATION_DETAILS}`: {
      return saveApplication(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: applicationDetails, status: apiMeta(APPLICATION_DETAILS) });
