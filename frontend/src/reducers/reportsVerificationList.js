import R from 'ramda';
import { getVerificationsReports } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const REPORTS_VERIFICATION_LOAD_STARTED = 'REPORTS_VERIFICATION_LOAD_STARTED';
export const REPORTS_VERIFICATION_LOAD_SUCCESS = 'REPORTS_VERIFICATION_LOAD_SUCCESS';
export const REPORTS_VERIFICATION_LOAD_FAILURE = 'REPORTS_VERIFICATION_LOAD_FAILURE';
export const REPORTS_VERIFICATION_LOAD_ENDED = 'REPORTS_VERIFICATION_LOAD_ENDED';

export const reportsVerificationLoadStarted = () => ({ type: REPORTS_VERIFICATION_LOAD_STARTED });
export const reportsVerificationLoadSuccess = response => ({ type: REPORTS_VERIFICATION_LOAD_SUCCESS, response });
export const reportsVerificationLoadFailure = error => ({ type: REPORTS_VERIFICATION_LOAD_FAILURE, error });
export const reportsVerificationLoadEnded = () => ({ type: REPORTS_VERIFICATION_LOAD_ENDED });

const saveVerificationReports = (state, action) => {
  const reports = R.assoc('items', action.response.results, state);
  return R.assoc('totalCount', action.response.count, reports);
};

const messages = {
  loadFailed: 'Loading verifications and observations reports failed.',
};

const initialState = {
  columns: [
    { name: 'legal_name', title: 'Organization\'s Legal Name' },
    { name: 'acronym', title: 'Acronym' },
    { name: 'organization_type', title: 'Type of Organization' },
    { name: 'country', title: 'Country' },
    { name: 'year', title: 'Verification Year' },
  ],
  loading: false,
  totalCount: 0,
  items: [],
};


export const loadVerificationReportsList = params => (dispatch) => {
  dispatch(reportsVerificationLoadStarted());
  
  return getVerificationsReports(params)
    .then((reports) => {
      dispatch(reportsVerificationLoadEnded());
      dispatch(reportsVerificationLoadSuccess(reports));
    })
    .catch((error) => {
      dispatch(reportsVerificationLoadEnded());
      dispatch(reportsVerificationLoadFailure(error));
    });
};

export default function loadVerificationReportsListReducer(state = initialState, action) {
  switch (action.type) {
    case REPORTS_VERIFICATION_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case REPORTS_VERIFICATION_LOAD_ENDED: {
      return stopLoading(state);
    }
    case REPORTS_VERIFICATION_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    case REPORTS_VERIFICATION_LOAD_SUCCESS: {
      return saveVerificationReports(state, action);
    }
    default:
      return state;
  }
}
