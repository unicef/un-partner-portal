import { combineReducers } from 'redux';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, { success } from './apiMeta';
import { getDashboard } from '../helpers/api/api';

const DASHBOARD = 'DASHBOARD';
const tag = 'dashboard';

const errorMsg = 'Couldn\'t load dashboard information, ' +
'please refresh page and try again';

const initialState = {};

export const loadDashboard = () => sendRequest({
  loadFunction: getDashboard,
  meta: {
    reducerTag: tag,
    actionTag: DASHBOARD,
  },
  errorHandling: { userMessage: errorMsg },
});

const Dashboard = (state = initialState, action) => {
  switch (action.type) {
    case success`${DASHBOARD}`: {
      return action.results;
    }
    default:
      return state;
  }
};

export default combineReducers({ data: Dashboard, status: apiMeta(DASHBOARD) });
