import R from 'ramda';
import { getPartnerVerifications } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const VERIFICATIONS_LOAD_STARTED = 'VERIFICATIONS_LOAD_STARTED';
export const VERIFICATIONS_LOAD_SUCCESS = 'VERIFICATIONS_LOAD_SUCCESS';
export const VERIFICATIONS_LOAD_FAILURE = 'VERIFICATIONS_LOAD_FAILURE';
export const VERIFICATIONS_LOAD_ENDED = 'VERIFICATIONS_LOAD_ENDED';

export const verificationsLoadStarted = () => ({ type: VERIFICATIONS_LOAD_STARTED });
export const verificationsLoadSuccess = response => ({ type: VERIFICATIONS_LOAD_SUCCESS, response });
export const verificationsLoadFailure = error => ({ type: VERIFICATIONS_LOAD_FAILURE, error });
export const verificationsLoadEnded = () => ({ type: VERIFICATIONS_LOAD_ENDED });

const saveVerifications = (state, action) => {
  const verifications = R.assoc('items', action.response.results, state);
  return R.assoc('totalCount', action.response.count, verifications);
};

const messages = {
  loadFailed: 'Loading verifications failed.',
};

const initialState = {
  columns: [
    { name: 'is_verified', title: 'Verification status' },
    { name: 'created', title: 'Date' },
    { name: 'name', title: 'Verified by' },
  ],
  loading: false,
  totalCount: 0,
  items: [],
};


export const loadVerificationsList = (id, params) => (dispatch) => {
  dispatch(verificationsLoadStarted());
  return getPartnerVerifications(id, params)
    .then((verifications) => {
      dispatch(verificationsLoadEnded());
      dispatch(verificationsLoadSuccess(verifications));
    })
    .catch((error) => {
      dispatch(verificationsLoadEnded());
      dispatch(verificationsLoadFailure(error));
    });
};

export default function agencyVerificationsListReducer(state = initialState, action) {
  switch (action.type) {
    case VERIFICATIONS_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case VERIFICATIONS_LOAD_ENDED: {
      return stopLoading(state);
    }
    case VERIFICATIONS_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    case VERIFICATIONS_LOAD_SUCCESS: {
      return saveVerifications(state, action);
    }
    default:
      return state;
  }
}
