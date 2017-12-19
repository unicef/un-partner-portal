import R from 'ramda';
import { combineReducers } from 'redux';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, { success } from './apiMeta';
import { getOpenCfeiApplications, changeApplicationStatus } from '../helpers/api/api';
import { APPLICATION_STATUSES } from '../helpers/constants';

const APPLICATION_STATUS_CHANGED = 'APPLICATION_STATUS_CHANGED';

const errorMsg = 'Couldn\'t load applications for this project, ' +
  'please refresh page and try again';
const PARTNERS_APPLICATIONS_LIST = 'PARTNERS_APPLICATIONS_LIST';
const tag = 'partnersApplicationsList';
const initialState = {
  columns: [
    { name: 'legal_name', title: 'Organization\'s Legal Name' },
    { name: 'type_org', title: 'Type of Organization' },
    { name: 'id', title: 'Application ID' },
    { name: 'status', title: 'Status', width: 300 },
  ],
  applications: [],
  itemsCount: 0,
};

const applicationStatusChanged = (ids, status) =>
  ({ type: APPLICATION_STATUS_CHANGED, ids, status });

export const loadApplications = (id, filter) => sendRequest({
  loadFunction: getOpenCfeiApplications,
  meta: {
    reducerTag: tag,
    actionTag: PARTNERS_APPLICATIONS_LIST,
    isPaginated: true,
  },
  errorHandling: { userMessage: errorMsg },
  apiParams: [id, filter],
});

export const changeAppStatus = (ids, status) => (dispatch) => {
  const promises = ids.map(id => changeApplicationStatus(id, status));
  Promise.all(promises).then((values) => {
    const changedIds = values.map(value => value.id);
    dispatch(applicationStatusChanged(changedIds, status));
  });
};

const saveApplications = (state, action) => {
  const itemsCount = R.assoc('itemsCount', action.count, state);
  return R.assoc('applications', action.results, itemsCount);
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
    case success`${PARTNERS_APPLICATIONS_LIST}`: {
      return saveApplications(state, action);
    }
    case APPLICATION_STATUS_CHANGED: {
      return changeStatus(state, action);
    }
    default:
      return state;
  }
}

export default combineReducers({ data: applicationsList,
  status: apiMeta(PARTNERS_APPLICATIONS_LIST) });
