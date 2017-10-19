import R from 'ramda';
import { combineReducers } from 'redux';
import applicationsListStatus, {
  LOAD_APPLICATION_LIST_SUCCESS,
  loadApplicationListStarted,
  loadApplicationListEnded,
  loadApplicationListSuccess,
  loadApplicationListFailure,

} from './partnersApplicationListStatus';
import { getOpenCfeiApplications, changeApplicationStatus } from '../helpers/api/api';
import { APPLICATION_STATUSES } from '../helpers/constants';

const APPLICATION_STATUS_CHANGED = 'APPLICATION_STATUS_CHANGED';

const initialState = {
  columns: [
    { name: 'legal_name', title: 'Organization\'s Legal Name' },
    { name: 'type_org', title: 'Type of Organization' },
    { name: 'id', title: 'Concept Note ID' },
    { name: 'status', title: 'Status' },
  ],
  applications: [],
  itemsCount: 0,
};

const applicationStatusChanged = (ids, status) =>
  ({ type: APPLICATION_STATUS_CHANGED, ids, status });

export const loadApplications = (id, filter) => (dispatch) => {
  dispatch(loadApplicationListStarted());
  return getOpenCfeiApplications(id, filter)
    .then((response) => {
      dispatch(loadApplicationListEnded());
      dispatch(loadApplicationListSuccess(response));
    })
    .catch((error) => {
      dispatch(loadApplicationListEnded());
      dispatch(loadApplicationListFailure(error));
    });
};

export const changeAppStatus = (ids, status) => (dispatch) => {
  const promises = ids.map(id => changeApplicationStatus(id, status));
  Promise.all(promises).then((values) => {
    const changedIds = values.map(value => value.id);
    dispatch(applicationStatusChanged(changedIds, status));
  });
};

const saveApplications = (state, action) => {
  const itemsCount = R.assoc('itemsCount', action.applications.count, state);
  return R.assoc('applications', action.applications.results, itemsCount);
};

const changeStatus = (state, action) => {
  if (action.status === APPLICATION_STATUSES.PEN) {
    return R.assoc('applications',
      R.filter(app => (!action.ids.includes(app.id)), state.applications),
      state,
    );
  }
  return R.assoc(
    'applications',
    R.map(
      (app) => {
        if (action.ids.includes(app.id)) return R.assoc('status', action.status, app);
        return app;
      },
      state.applications),
    state);
};


function applicationsList(state = initialState, action) {
  switch (action.type) {
    case LOAD_APPLICATION_LIST_SUCCESS: {
      return saveApplications(state, action);
    }
    case APPLICATION_STATUS_CHANGED: {
      return changeStatus(state, action);
    }
    default:
      return state;
  }
}

export default combineReducers({ applicationsList, status: applicationsListStatus });
