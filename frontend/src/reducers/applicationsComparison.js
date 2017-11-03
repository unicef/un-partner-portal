import { combineReducers } from 'redux';
import ApplicationsComparisonStatus, {
  loadApplicationsComparisonStarted,
  loadApplicationsComparisonEnded,
  loadApplicationsComparisonSuccess,
  loadApplicationsComparisonFailure,
  LOAD_APPLICATIONS_COMPARISON_SUCCESS,
} from './applicationsComparisonStatus';
import { getApplicationComparison } from '../helpers/api/api';

const initialState = [];

export const loadApplicationComparison = (cfeiId, application_ids) => (dispatch) => {
  dispatch(loadApplicationsComparisonStarted());
  return getApplicationComparison(cfeiId, { application_ids: application_ids.join(',') })
    .then((comparison) => {
      dispatch(loadApplicationsComparisonEnded());
      dispatch(loadApplicationsComparisonSuccess(comparison, cfeiId));
      return comparison;
    })
    .catch((error) => {
      dispatch(loadApplicationsComparisonEnded());
      dispatch(loadApplicationsComparisonFailure(error));
    });
};

const saveApplicationsComparison = (state, action) =>
  action.comparison;

const ApplicationsComparison = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_APPLICATIONS_COMPARISON_SUCCESS: {
      return saveApplicationsComparison(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: ApplicationsComparison,
  status: ApplicationsComparisonStatus });
