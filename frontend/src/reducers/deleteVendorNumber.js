import { combineReducers } from 'redux';
import { deletePartnerVendorId } from '../helpers/api/api';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../reducers/apiMeta';
import { loadPartnerProfileSummary } from './agencyPartnerProfile';

export const DELETE_VENDOR_NUMBER = 'DELETE_VENDOR_NUMBER';

const initialState = {
  deleteVendorNumberSubmitting: false,
  deleteVendorNumberProcessing: false,
  error: {},
};

export const deleteVendorNumber = (vendorId, id) => (dispatch) => {
  dispatch(loadStarted(DELETE_VENDOR_NUMBER));
  return deletePartnerVendorId(vendorId)
    .then(() => {
      dispatch(loadEnded(DELETE_VENDOR_NUMBER));
      dispatch(loadSuccess(DELETE_VENDOR_NUMBER));
      dispatch(loadPartnerProfileSummary(id));
    })
    .catch((error) => {
      dispatch(loadEnded(DELETE_VENDOR_NUMBER));
      dispatch(loadFailure(DELETE_VENDOR_NUMBER, error));
      throw error;
    });
};

function deleteVendorNumberReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${DELETE_VENDOR_NUMBER}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: deleteVendorNumberReducer,
  status: apiMeta(DELETE_VENDOR_NUMBER) });
