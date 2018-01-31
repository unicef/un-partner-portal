import { combineReducers } from 'redux';
import { getApplicationComparison } from '../helpers/api/api';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, {
  success,
} from './apiMeta';

const errorReportMessage = 'Couldn\'t download report, please refresh page and try again';

const APPLICATIONS_COMPARISON_REPORT = 'APPLICATIONS_COMPARISON_REPORT';
const tag = 'applicationsComparisonReport';

const initialState = null;

export const downloadComparisonReport = (cfeiId, applicationIds) => sendRequest({
  loadFunction: getApplicationComparison,
  meta: {
    reducerTag: tag,
    actionTag: APPLICATIONS_COMPARISON_REPORT,
    isPaginated: false,
  },
  errorHandling: { userMessage: errorReportMessage },
  apiParams: [cfeiId, { application_ids: applicationIds.join(','), export: 'xlsx' }, {responseType: 'blob'}],
});

const saveApplicationsComparisonReport = (state, action) => action.results;
 

const ApplicationsComparisonReport = (state = initialState, action) => {
  switch (action.type) {
    case success`${APPLICATIONS_COMPARISON_REPORT}`: {
      return saveApplicationsComparisonReport(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: ApplicationsComparisonReport,
  status: apiMeta(APPLICATIONS_COMPARISON_REPORT) });
