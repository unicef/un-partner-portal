import R from 'ramda';
import { getPartnerVerifications } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const REPORTS_LOAD_STARTED = 'REPORTS_LOAD_STARTED';
export const REPORTS_LOAD_SUCCESS = 'REPORTS_LOAD_SUCCESS';
export const REPORTS_LOAD_FAILURE = 'REPORTS_LOAD_FAILURE';
export const REPORTS_LOAD_ENDED = 'REPORTS_LOAD_ENDED';

export const verificationsLoadStarted = () => ({ type: REPORTS_LOAD_STARTED });
export const verificationsLoadSuccess = response => ({ type: REPORTS_LOAD_SUCCESS, response });
export const verificationsLoadFailure = error => ({ type: REPORTS_LOAD_FAILURE, error });
export const verificationsLoadEnded = () => ({ type: REPORTS_LOAD_ENDED });

const saveVerifications = (state, action) => {
  const verifications = R.assoc('items', action.response.results, state);
  return R.assoc('totalCount', action.response.count, verifications);
};

const messages = {
  loadFailed: 'Loading verifications failed.',
};

const initialState = {
  columns: [
    { name: 'legal_name', title: 'Organization\'s Legal Name' },
    { name: 'orgnization_type', title: 'Type of Organization' },
    { name: 'country', title: 'Country' },
    // unsure about fieldname here
    { name: 'no_of_offices', title: '# of Offices' },
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
    case REPORTS_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case REPORTS_LOAD_ENDED: {
      return stopLoading(state);
    }
    case REPORTS_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    case REPORTS_LOAD_SUCCESS: {
      return saveVerifications(state, action);
    }
    default:
      return state;
  }
}
