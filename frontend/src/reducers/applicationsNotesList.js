import R from 'ramda';
import { normalizeSingleCfei } from './cfei';
import { getApplicationConceptNotes } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const APPLICATIONS_CN_LOAD_STARTED = 'APPLICATIONS_CN_LOAD_STARTED';
export const APPLICATIONS_CN_LOAD_SUCCESS = 'APPLICATIONS_CN_LOAD_SUCCESS';
export const APPLICATIONS_CN_LOAD_FAILURE = 'APPLICATIONS_CN_LOAD_FAILURE';
export const APPLICATIONS_CN_LOAD_ENDED = 'APPLICATIONS_CN_LOAD_ENDED';


export const applicationsCnLoadStarted = () => ({ type: APPLICATIONS_CN_LOAD_STARTED });
export const applicationsCnSuccess = response => ({ type: APPLICATIONS_CN_LOAD_SUCCESS, response });
export const applicationsCnFailure = error => ({ type: APPLICATIONS_CN_LOAD_FAILURE, error });
export const applicationsCnEnded = () => ({ type: APPLICATIONS_CN_LOAD_ENDED });


const initialState = {
  columns: [
    { name: 'project_title', title: 'Project Title', width: 250 },
    { name: 'project_displayID', title: 'CFEI ID' },
    { name: 'agency_name', title: 'UN Agency' },
    { name: 'country', title: 'Country' },
    { name: 'specializations', title: 'Sector' },
    { name: 'application_date', title: 'Application Date' },
    { name: 'application_status', title: 'Status', width: 200 },
  ],
  loading: false,
  items: [],
  totalCount: 0,
};

const saveApplicationsCn = (state, action) => {
  const applications = R.map(item =>
    ({
      id: item.id,
      project_title: item.project_title,
      agency_name: item.agency_name,
      eoi_id: item.eoi_id,
      country: item.country,
      specializations: R.path(['specializations'], item) ? normalizeSingleCfei(item).specializations : [],
      application_date: item.application_date,
      application_status: item.application_status,
      project_displayID: item.project_displayID,
    }), action.response.results);

  return R.assoc('items', applications, R.assoc('totalCount', action.response.count, state));
};

const messages = {
  loadFailed: 'Load applications failed.',
};

export const loadApplicationsCn = params => (dispatch) => {
  dispatch(applicationsCnLoadStarted());
  return getApplicationConceptNotes(params)
    .then((applications) => {
      dispatch(applicationsCnEnded());
      dispatch(applicationsCnSuccess(applications));
    })
    .catch((error) => {
      dispatch(applicationsCnEnded());
      dispatch(applicationsCnFailure(error));
    });
};

export default function applicationsNotesListReducer(state = initialState, action) {
  switch (action.type) {
    case APPLICATIONS_CN_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case APPLICATIONS_CN_LOAD_ENDED: {
      return stopLoading(state);
    }
    case APPLICATIONS_CN_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    case APPLICATIONS_CN_LOAD_SUCCESS: {
      return saveApplicationsCn(state, action);
    }
    default:
      return state;
  }
}
