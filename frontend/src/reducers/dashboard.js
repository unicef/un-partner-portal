import { combineReducers } from 'redux';
import R from 'ramda';
import DashboardStatus, {
  loadDashboardStarted,
  loadDashboardEnded,
  loadDashboardSuccess,
  loadDashboardFailure,
  LOAD_DASHBOARD_SUCCESS,
} from './dashboardStatus';

import { getDashboard } from '../helpers/api/api';

const initialState = {};

export const loadDashboard = () => (dispatch) => {
  dispatch(loadDashboardStarted());
  return getDashboard()
    .then((dashboard) => {
      dispatch(loadDashboardEnded());
      dispatch(loadDashboardSuccess(dashboard));
      return dashboard;
    })
    .catch((error) => {
      dispatch(loadDashboardEnded());
      dispatch(loadDashboardFailure(error));
    });
};

const Dashboard = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_DASHBOARD_SUCCESS: {
      return action.dashboard;
    }
    default:
      return state;
  }
};

export default combineReducers({ data: Dashboard, status: DashboardStatus });
