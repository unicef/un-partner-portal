import { combineReducers } from 'redux';
import { getApplicationComparison } from '../helpers/api/api';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, {
  success,
} from './apiMeta';

const errorMessage = 'Couldn\'t load applications comparison, please refresh page and try again';

const APPLICATIONS_COMPARISON = 'APPLICATIONS_COMPARISON';
const tag = 'applicationsComparison';

const initialState = [];

export const loadApplicationComparison = (cfeiId, applicationIds) => sendRequest({
  loadFunction: getApplicationComparison,
  meta: {
    reducerTag: tag,
    actionTag: APPLICATIONS_COMPARISON,
    isPaginated: false,
  },
  errorHandling: { userMessage: errorMessage },
  apiParams: [cfeiId, { application_ids: applicationIds.join(',') }],
});

const saveApplicationsComparison = (state, action) =>
  action.results;

const ApplicationsComparison = (state = initialState, action) => {
  switch (action.type) {
    case success`${APPLICATIONS_COMPARISON}`: {
      return saveApplicationsComparison(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: ApplicationsComparison,
  status: apiMeta(APPLICATIONS_COMPARISON) });
