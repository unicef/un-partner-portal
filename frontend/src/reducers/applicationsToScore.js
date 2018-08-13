import { combineReducers } from 'redux';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, {
  success,
} from './apiMeta';
import { getApplicationsToScore } from '../helpers/api/api';


const errorMessage = 'Couldn\'t load submitted CN, please refresh page and try again';

const APPLICATIONS_TO_SCORE = 'APPLICATIONS_TO_SCORE';
const tag = 'applicationsToScore';

const initialState = {
  applications: [],
  count: 0,
};

export const loadApplicationsToScore = params => sendRequest({
  loadFunction: getApplicationsToScore,
  meta: {
    reducerTag: tag,
    actionTag: APPLICATIONS_TO_SCORE,
    isPaginated: true,
  },
  errorHandling: { userMessage: errorMessage },
  apiParams: [params],
});

export const saveApplications = (action) => {
  const { results: applications, count } = action;
  const newApplications = applications.map(({ eoi: {
    title,
    id,
    deadline_date,
    displayID,
  }, eoi_applications_count }) => ({
    title,
    id,
    deadline_date,
    eoi_applications_count,
    displayID,
  }));
  return { applications: newApplications, count };
};

const ApplicationsToScore = (state = initialState, action) => {
  switch (action.type) {
    case success`${APPLICATIONS_TO_SCORE}`: {
      return saveApplications(action);
    }
    default:
      return state;
  }
};

export default combineReducers(
  { data: ApplicationsToScore, status: apiMeta(APPLICATIONS_TO_SCORE) });
