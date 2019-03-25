import {
  getPartnerProfileReports,
  getPartnerContactReports,
  getProjectDetailsReports,
  getPartnerVerificationReports,
  getPartnerMappingReports
} from '../helpers/api/api';
import download from 'downloadjs';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';
import { formatDateForPrint } from '../helpers/dates';
import { errorToBeAdded } from './errorReducer';

export const REPORTS_GENERATE_LOAD_STARTED = 'REPORTS_GENERATE_LOAD_STARTED';
export const REPORTS_GENERATE_LOAD_SUCCESS = 'REPORTS_GENERATE_LOAD_SUCCESS';
export const REPORTS_GENERATE_LOAD_FAILURE = 'REPORTS_GENERATE_LOAD_FAILURE';
export const REPORTS_GENERATE_LOAD_ENDED = 'REPORTS_GENERATE_LOAD_ENDED';

export const reportsGenerateLoadStarted = () => ({ type: REPORTS_GENERATE_LOAD_STARTED });
export const reportsGenerateLoadFailure = error => ({ type: REPORTS_GENERATE_LOAD_FAILURE, error });
export const reportsGenerateLoadEnded = () => ({ type: REPORTS_GENERATE_LOAD_ENDED });

const messages = {
  loadFailed: 'Generating reports failed.',
  sentEmail: 'Report will be sent to email.',
  tooManyResults: 'Too many objects selected for export. Use filters to narrow down the search.',

};

const initialState = {
  loading: false,
};

const handleError = (dispatch, error) => {
  if (error.response.status === 400) {
    dispatch(errorToBeAdded(error, 'export_report', messages.tooManyResults));
  } else if (error.response.status === 202) {
    dispatch(errorToBeAdded(error, 'export_report', messages.sentEmail));
  }
} 

export const getPartnerProfileReport = params => (dispatch) => {
  dispatch(reportsGenerateLoadStarted());

  return getPartnerProfileReports(params)
    .then((data) => {
      dispatch(reportsGenerateLoadEnded());

      return data;
    })
    .catch((error) => {
      dispatch(reportsGenerateLoadEnded());
      dispatch(reportsGenerateLoadFailure(error));

      handleError(dispatch, error);
    });
};

export const getPartnerContactReport = params => (dispatch) => {
  dispatch(reportsGenerateLoadStarted());

  return getPartnerContactReports(params)
    .then((data) => { 
      dispatch(reportsGenerateLoadEnded());

      return data;
    })
    .catch((error) => {
      dispatch(reportsGenerateLoadEnded());
      dispatch(reportsGenerateLoadFailure(error));

      handleError(dispatch, error);
    });
};

export const getPartnerMappingReport = params => (dispatch) => {
  dispatch(reportsGenerateLoadStarted());

  return getPartnerMappingReports(params)
    .then((data) => {
      dispatch(reportsGenerateLoadEnded());

      return data;
    })
    .catch((error) => {
      dispatch(reportsGenerateLoadEnded());
      dispatch(reportsGenerateLoadFailure(error));

      handleError(dispatch, error);
    });
};

export const getProjectReport = params => (dispatch) => {
  dispatch(reportsGenerateLoadStarted());

  return getProjectDetailsReports(params)
    .then((data) => { 
      dispatch(reportsGenerateLoadEnded());

      return data;
    })
    .catch((error) => {
      dispatch(reportsGenerateLoadEnded());
      dispatch(reportsGenerateLoadFailure(error));

      handleError(dispatch, error);
    });
};

export const getVerificationReport = params => (dispatch) => {
  dispatch(reportsGenerateLoadStarted());

  return getPartnerVerificationReports(params)
    .then((data) => { 
      dispatch(reportsGenerateLoadEnded());

      return data;
    })
    .catch((error) => {
      dispatch(reportsGenerateLoadEnded());
      dispatch(reportsGenerateLoadFailure(error));

      handleError(dispatch, error);
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
