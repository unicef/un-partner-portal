import { getPartnerProfileReports, getPartnerContactReports, getProjectDetailsReports, getPartnerVerificationReports } from '../helpers/api/api';
import download from 'downloadjs';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';
import { formatDateForPrint } from '../helpers/dates';

export const REPORTS_GENERATE_LOAD_STARTED = 'REPORTS_GENERATE_LOAD_STARTED';
export const REPORTS_GENERATE_LOAD_SUCCESS = 'REPORTS_GENERATE_LOAD_SUCCESS';
export const REPORTS_GENERATE_LOAD_FAILURE = 'REPORTS_GENERATE_LOAD_FAILURE';
export const REPORTS_GENERATE_LOAD_ENDED = 'REPORTS_GENERATE_LOAD_ENDED';

export const reportsGenerateLoadStarted = () => ({ type: REPORTS_GENERATE_LOAD_STARTED });
export const reportsGenerateLoadFailure = error => ({ type: REPORTS_GENERATE_LOAD_FAILURE, error });
export const reportsGenerateLoadEnded = () => ({ type: REPORTS_GENERATE_LOAD_ENDED });

const messages = {
  loadFailed: 'Generating reports failed.',
};

const initialState = {
  loading: false,
};

export const getPartnerProfileReport = params => (dispatch) => {
  dispatch(reportsGenerateLoadStarted());

  return getPartnerProfileReports(params, { responseType: 'blob' })
    .then((data) => {
      download(data, `Profile Report - ${formatDateForPrint(new Date())}.xlsx`);
      dispatch(reportsGenerateLoadEnded());
    })
    .catch((error) => {
      dispatch(reportsGenerateLoadEnded());
      dispatch(reportsGenerateLoadFailure(error));
    });
};

export const getPartnerContactReport = params => (dispatch) => {
  dispatch(reportsGenerateLoadStarted());

  return getPartnerContactReports(params, { responseType: 'blob' })
    .then((data) => {
      download(data, `Contact Report - ${formatDateForPrint(new Date())}.xlsx`);
      dispatch(reportsGenerateLoadEnded());
    })
    .catch((error) => {
      dispatch(reportsGenerateLoadEnded());
      dispatch(reportsGenerateLoadFailure(error));
    });
};

export const getProjectReport = params => (dispatch) => {
  dispatch(reportsGenerateLoadStarted());

  return getProjectDetailsReports(params, { responseType: 'blob' })
    .then((data) => {
      download(data, `Project Report - ${formatDateForPrint(new Date())}.xlsx`);
      dispatch(reportsGenerateLoadEnded());
    })
    .catch((error) => {
      dispatch(reportsGenerateLoadEnded());
      dispatch(reportsGenerateLoadFailure(error));
    });
};

export const getVerificationReport = params => (dispatch) => {
  dispatch(reportsGenerateLoadStarted());

  return getPartnerVerificationReports(params, { responseType: 'blob' })
    .then((data) => {
      download(data, `Observation Report - ${formatDateForPrint(new Date())}.xlsx`);
      dispatch(reportsGenerateLoadEnded());
    })
    .catch((error) => {
      dispatch(reportsGenerateLoadEnded());
      dispatch(reportsGenerateLoadFailure(error));
    });
};

export default function loadGenerateReportsListReducer(state = initialState, action) {
  switch (action.type) {
    case REPORTS_GENERATE_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case REPORTS_GENERATE_LOAD_ENDED: {
      return stopLoading(state);
    }
    case REPORTS_GENERATE_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    default:
      return state;
  }
}
