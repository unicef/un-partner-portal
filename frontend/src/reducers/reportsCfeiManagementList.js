import R from 'ramda';
import { getProjectReports } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const REPORTS_CFEI_LOAD_STARTED = 'REPORTS_CFEI_LOAD_STARTED';
export const REPORTS_CFEI_LOAD_SUCCESS = 'REPORTS_CFEI_LOAD_SUCCESS';
export const REPORTS_CFEI_LOAD_FAILURE = 'REPORTS_CFEI_LOAD_FAILURE';
export const REPORTS_CFEI_LOAD_ENDED = 'REPORTS_CFEI_LOAD_ENDED';

export const reportsCfeiLoadStarted = () => ({ type: REPORTS_CFEI_LOAD_STARTED });
export const reportsCfeiLoadSuccess = response => ({ type: REPORTS_CFEI_LOAD_SUCCESS, response });
export const reportsCfeiLoadFailure = error => ({ type: REPORTS_CFEI_LOAD_FAILURE, error });
export const reportsCfeiLoadEnded = () => ({ type: REPORTS_CFEI_LOAD_ENDED });

const saveCfeiReports = (state, action) => {
  const reports = R.assoc('items', action.response.results, state);
  return R.assoc('totalCount', action.response.count, reports);
};

const messages = {
  loadFailed: 'Loading CFEI reports failed.',
};

const initialState = {
  columns: [
    { name: 'title', title: 'Project Title' },
    { name: 'locations', title: 'Country' },
    { name: 'project_locations', title: 'Project Location' },
    { name: 'type', title: 'Type of expresssion of interest' },
  ],
  loading: false,
  totalCount: 0,
  items: [],
};


export const loadCfeiReportsList = params => (dispatch) => {
  dispatch(reportsCfeiLoadStarted());

  return getProjectReports(params)
    .then((reports) => {
      dispatch(reportsCfeiLoadEnded());
      dispatch(reportsCfeiLoadSuccess(reports));
    })
    .catch((error) => {
      dispatch(reportsCfeiLoadEnded());
      dispatch(reportsCfeiLoadFailure(error));
    });
};

export default function loadCfeiReportsListReducer(state = initialState, action) {
  switch (action.type) {
    case REPORTS_CFEI_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case REPORTS_CFEI_LOAD_ENDED: {
      return stopLoading(state);
    }
    case REPORTS_CFEI_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    case REPORTS_CFEI_LOAD_SUCCESS: {
      return saveCfeiReports(state, action);
    }
    default:
      return state;
  }
}
