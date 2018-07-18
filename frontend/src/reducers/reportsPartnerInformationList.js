import R from 'ramda';
import { getPartnerReports } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const REPORTS_PARTNER_LOAD_STARTED = 'REPORTS_PARTNER_LOAD_STARTED';
export const REPORTS_PARTNER_LOAD_SUCCESS = 'REPORTS_PARTNER_LOAD_SUCCESS';
export const REPORTS_PARTNER_LOAD_FAILURE = 'REPORTS_PARTNER_LOAD_FAILURE';
export const REPORTS_PARTNER_LOAD_ENDED = 'REPORTS_PARTNER_LOAD_ENDED';

export const reportsPartnerLoadStarted = () => ({ type: REPORTS_PARTNER_LOAD_STARTED });
export const reportsPartnerLoadSuccess = response => ({ type: REPORTS_PARTNER_LOAD_SUCCESS, response });
export const reportsPartnerLoadFailure = error => ({ type: REPORTS_PARTNER_LOAD_FAILURE, error });
export const reportsPartnerLoadEnded = () => ({ type: REPORTS_PARTNER_LOAD_ENDED });

const savePartnerReports = (state, action) => {
  const reports = R.assoc('items', action.response.results, state);
  return R.assoc('totalCount', action.response.count, reports);
};

const messages = {
  loadFailed: 'Loading partner reports failed.',
};

const initialState = {
  columns: [
    { name: 'legal_name', title: 'Organization\'s Legal Name' },
    { name: 'organization_type', title: 'Type of Organization' },
    { name: 'country', title: 'Country' },
    { name: 'no_of_offices', title: '# of Offices' },
    { name: 'agency_experiences', title: 'UN experience' },
  ],
  loading: false,
  totalCount: 0,
  items: [],
};


export const loadPartnerReportsList = params => (dispatch) => {
  dispatch(reportsPartnerLoadStarted());
  
  return getPartnerReports(params)
    .then((reports) => {
      dispatch(reportsPartnerLoadEnded());
      dispatch(reportsPartnerLoadSuccess(reports));
    })
    .catch((error) => {
      dispatch(reportsPartnerLoadEnded());
      dispatch(reportsPartnerLoadFailure(error));
    });
};

export default function loadPartnerReportsListReducer(state = initialState, action) {
  switch (action.type) {
    case REPORTS_PARTNER_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case REPORTS_PARTNER_LOAD_ENDED: {
      return stopLoading(state);
    }
    case REPORTS_PARTNER_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    case REPORTS_PARTNER_LOAD_SUCCESS: {
      return savePartnerReports(state, action);
    }
    default:
      return state;
  }
}
