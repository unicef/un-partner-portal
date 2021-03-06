import R from 'ramda';
import { patchApplication } from '../helpers/api/api';

const initialState = {};

export const LOAD_PARTNER_APPLICATION_SUCCESS = 'LOAD_APPLICATION_SUMMARY';
export const DELETE_APPLICATION = 'DELETE_APPLICATION';
export const UPDATE_APPLICATION_PARTNER_NAME = 'UPDATE_APPLICATION_PARTNER_NAME';

export const deleteApplication = applicationId => ({ type: DELETE_APPLICATION, applicationId });

export const loadPartnerApplication = (cfeiId, application) => (
  { type: LOAD_PARTNER_APPLICATION_SUCCESS, cfeiId, application });

const deletePartnerApplication = (state, applicationId) =>
  R.filter(item => item.id === applicationId, state);

export const updateApplication = (cfeiId, applicationId, body) => (dispatch, getState) =>
  patchApplication(applicationId, body)
    .then((application) => {
      dispatch(loadPartnerApplication(cfeiId, application, getState));
      return application;
    });

const saveApplication = (state, action) => R.assoc(action.cfeiId, action.application, state);

export function selectApplication(state, id) {
  const { [id]: application = {} } = state;
  return application;
}

const applicationDetails = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PARTNER_APPLICATION_SUCCESS: {
      return saveApplication(state, action);
    }
    case DELETE_APPLICATION: {
      return deletePartnerApplication(state, action);
    }
    default:
      return state;
  }
};

export default applicationDetails;
