import { combineReducers } from 'redux';
import R from 'ramda';
import applicationReviewsStatus, {
  loadApplicationReviewsStarted,
  loadApplicationReviewsEnded,
  loadApplicationReviewsSuccess,
  loadApplicationReviewsFailure,
  LOAD_APPLICATION_DETAIL_SUCCESS,
} from './applicationReviewsStatus';

import { getApplicationReviewss } from '../helpers/api/api';

const initialState = {};

export const loadApplicationReviews = id => (dispatch, getState) => {
  dispatch(loadApplicationReviewsStarted());
  return getApplicationReviewss(id)
    .then((application) => {
      dispatch(loadApplicationReviewsEnded());
      dispatch(loadApplicationReviewsSuccess(id, getState));
      return application;
    })
    .catch((error) => {
      dispatch(loadApplicationReviewsEnded());
      dispatch(loadApplicationReviewsFailure(error));
    });
};

const saveReviews = (state, action) => {
  return R.assoc(action.id, action.review, state);
};

export function selectApplication(state, id) {
  return state[id] ? state[id] : null;
}

export function selectApplicationStatus(state, id) {
  return state[id] ? state[id].status : '';
}

export function selectApplicationPartnerName(state, id) {
  return state[id] ? state[id].partner_name : '';
}

export function selectApplicationProject(state, id) {
  return state[id] ? state[id].eoi : null;
}

const saveApplicationSync = (state, action) => {
  if (selectApplication(state, action.id)) return state;
  const { id, name, status } = action;
  return R.assoc(
    id,
    { id, status, partner_name: name },
    state);
};

const applicationReviews = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_APPLICATION_DETAIL_SUCCESS: {
      return saveApplication(state, action);
    }
    case LOAD_APPLICATION_SUMMARY: {
      return saveApplicationSync(state, action);
    }
    case UPDATE_APPLICATION_PARTNER_NAME: {
      return saveNewApplicationPartnerName(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ reviews: applicationReviews, status: applicationReviewsStatus });
