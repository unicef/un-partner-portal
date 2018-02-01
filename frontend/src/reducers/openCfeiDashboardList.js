import { combineReducers } from 'redux';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, {
  success,
} from './apiMeta';
import { getOpenCfeiDashboard } from '../helpers/api/api';


const errorMessage = 'Couldn\'t load open Cfei list, please refresh page and try again';

const OPEN_CFEI_DASHBOARD = 'OPEN_CFEI';
const tag = 'openCfeiList';

const initialState = {
  applications: [],
  count: 0,
};

export const loadOpenCfeiList = params => sendRequest({
  loadFunction: getOpenCfeiDashboard,
  meta: {
    reducerTag: tag,
    actionTag: OPEN_CFEI_DASHBOARD,
    isPaginated: true,
  },
  errorHandling: { userMessage: errorMessage },
  apiParams: [params],
});

export const saveApplications = (action) => {
  const { results: applications, count } = action;
  const newApplications = applications.map(({
    title,
    id,
    deadline_date,
    applications_count,
  }) => ({
    title,
    id,
    deadline_date,
    applications_count,
  }));
  return { applications: newApplications, count };
};

const OpenCfeiDashboardList = (state = initialState, action) => {
  switch (action.type) {
    case success`${OPEN_CFEI_DASHBOARD}`: {
      return saveApplications(action);
    }
    default:
      return state;
  }
};

export default combineReducers(
  { data: OpenCfeiDashboardList, status: apiMeta(OPEN_CFEI_DASHBOARD) });
