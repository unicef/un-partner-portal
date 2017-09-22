import R from 'ramda';
import { combineReducers } from 'redux';
import applicationsListStatus, {
  LOAD_APPLICATION_LIST_SUCCESS,
  loadApplicationListStarted,
  loadApplicationListEnded,
  loadApplicationListSuccess,
  loadApplicationListFailure,

} from './partnersApplicationListStatus';
import { getOpenCfeiApplications } from '../helpers/api/api';

const initialState = {
  columns: [
    { name: 'legal_name', title: 'Organization\'s Legal Name' },
    { name: 'type_org', title: 'Type of Organization' },
    { name: 'id', title: 'Concept Note ID' },
    { name: 'status', title: 'Status' },
  ],
  applications: [],
};

export const loadApplications = (id, filter) => (dispatch) => {
  dispatch(loadApplicationListStarted());
  return getOpenCfeiApplications(id, filter)
    .then((response) => {
      dispatch(loadApplicationListEnded());
      dispatch(loadApplicationListSuccess(response.results));
    })
    .catch((error) => {
      dispatch(loadApplicationListEnded());
      dispatch(loadApplicationListFailure(error));
    });
};

const saveApplications = (state, action) => R.assoc('applications', action.applications, state);

function applicationsList(state = initialState, action) {
  switch (action.type) {
    case LOAD_APPLICATION_LIST_SUCCESS: {
      return saveApplications(state, action);
    }
    default:
      return state;
  }
}

export default combineReducers({ applicationsList, status: applicationsListStatus });
