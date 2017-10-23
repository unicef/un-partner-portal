import { combineReducers } from 'redux';
import R from 'ramda';
import { patchApplication } from '../helpers/api/api';

const initialState = {};
export const LOAD_PARTNER_APPLICATION_SUCCESS = 'LOAD_APPLICATION_SUMMARY';
export const UPDATE_APPLICATION_PARTNER_NAME = 'UPDATE_APPLICATION_PARTNER_NAME';

export const loadPartnerApplication = (cfeiId, application) => (
  { type: LOAD_PARTNER_APPLICATION_SUCCESS, cfeiId, application });

export const updateApplication = (applicationId, body) => (dispatch, getState) =>
  patchApplication(applicationId, body)
    .then((application) => {
      dispatch(loadPartnerApplication(application.eoi, application, getState));
      return application;
    });

const saveApplication = (state, action) =>
  R.assoc(action.cfeiId, action.application, state);

export function selectApplication(state, id) {
  const { [id]: application = {} } = state;
  return application;
}

const applicationDetails = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PARTNER_APPLICATION_SUCCESS: {
      return saveApplication(state, action);
    }
    default:
      return state;
  }
};

export default applicationDetails;
