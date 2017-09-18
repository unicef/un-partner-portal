import R from 'ramda';
import { combineReducers } from 'redux';
import { getPartnerProfileDetails } from '../helpers/api/api';
import { mapJsonSteps, flatten } from '../helpers/jsonMapper';
import detailsStatus, {
  loadDetailsStarted,
  loadDetailsSuccess,
  loadDetailsEnded,
  loadDetailsFailure,
  LOAD_DETAILS_SUCCESS } from './partnerProfileDetailsStatus';
import detailsStructure from './partnerProfileDetailsStructure';

const initialState = {
  identification: null,
  mailing_address: null,
  mandate_mission: null,
  fund: null,
  collaboration: null,
  project_impl: null,
  other_info: null,
};

export const loadPartnerDetails = partnerId => (dispatch) => {
  dispatch(loadDetailsStarted());
  return getPartnerProfileDetails(partnerId)
    .then((details) => {
      dispatch(loadDetailsEnded());
      dispatch(loadDetailsSuccess(details));
    })
    .catch((error) => {
      dispatch(loadDetailsEnded());
      dispatch(loadDetailsFailure(error));
    });
};

const savePartnerProfileDetails = (state, action) => {
  const flatjson = flatten(action.partnerDetails);

  return R.mapObjIndexed((value, key) =>
    mapJsonSteps(key, value, flatjson), detailsStructure);
};

const partnerProfileDetails = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_DETAILS_SUCCESS: {
      return savePartnerProfileDetails(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ partnerProfileDetails, detailsStatus });

