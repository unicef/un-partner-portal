import { combineReducers } from 'redux';
import { postPartnerVendorId } from '../helpers/api/api';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../reducers/apiMeta';
import { loadPartnerProfileSummary } from './agencyPartnerProfile';

export const NEW_VENDOR_NUMBER = 'NEW_VENDOR_NUMBER';

const initialState = {
  newVendorNumberSubmitting: false,
  newVendorNumberProcessing: false,
  error: {},
};

export const addVendorNumber = (body, id) => (dispatch) => {
  dispatch(loadStarted(NEW_VENDOR_NUMBER));
  return postPartnerVendorId(body)
    .then((number) => {
      dispatch(loadEnded(NEW_VENDOR_NUMBER));
      dispatch(loadSuccess(NEW_VENDOR_NUMBER));
      dispatch(loadPartnerProfileSummary(id));
      return number;
    })
    .catch((error) => {
      dispatch(loadEnded(NEW_VENDOR_NUMBER));
      dispatch(loadFailure(NEW_VENDOR_NUMBER, error));
      throw error;
    });
};

function addVendorNumberReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${NEW_VENDOR_NUMBER}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: addVendorNumberReducer,
  status: apiMeta(NEW_VENDOR_NUMBER) });
