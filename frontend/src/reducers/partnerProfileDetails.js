import R from 'ramda';
import { combineReducers } from 'redux';
import { getPartnerProfileDetails } from '../helpers/api/api';
import detailsStatus, {
  loadDetailsStarted,
  loadDetailsSuccess,
  loadDetailsEnded,
  loadDetailsFailure,
  LOAD_DETAILS_SUCCESS } from './partnerProfileDetailsStatus';

const initialState = {
  partnerId: 0,
  partnerDetails: [],
};

export const loadPartnerDetails = partnerId => (dispatch) => { 
    debugger
  dispatch(loadDetailsStarted());
  return getPartnerProfileDetails(partnerId)
    .then((partnerDetails) => {
        debugger
      dispatch(loadDetailsEnded());
      dispatch(loadDetailsSuccess(partnerDetails));
    })
    .catch((error) => {
        debugger
      dispatch(loadDetailsEnded());
      dispatch(loadDetailsFailure(error));
    });
};

const savePartnerProfileDetails = (state, action) => {
  console.log('LOADED', action, state);
  return R.assoc(action.cfei, state);
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

