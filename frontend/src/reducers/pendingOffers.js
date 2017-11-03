import { combineReducers } from 'redux';
import PendingOffersStatus, {
  loadPendingOffersStarted,
  loadPendingOffersEnded,
  loadPendingOffersSuccess,
  loadPendingOffersFailure,
  LOAD_PENDING_OFFERS_SUCCESS,
} from './pendingOffersStatus';
import { normalizeSingleCfei } from './cfei';

import { getPendingOffers } from '../helpers/api/api';

const initialState = {
  applications: [],
  count: 0,
};

export const loadPendingOffers = params => (dispatch) => {
  dispatch(loadPendingOffersStarted());
  return getPendingOffers(params)
    .then(({ results, count }) => {
      dispatch(loadPendingOffersEnded());
      dispatch(loadPendingOffersSuccess(results, count));
      return results;
    })
    .catch((error) => {
      dispatch(loadPendingOffersEnded());
      dispatch(loadPendingOffersFailure(error));
    });
};

export const savePendingOffers = (action) => {
  const { offers, count } = action;
  const newPendingOffers = offers.map(normalizeSingleCfei);
  return { pendingOffers: newPendingOffers, count };
};

const PendingOffers = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PENDING_OFFERS_SUCCESS: {
      return savePendingOffers(action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: PendingOffers, status: PendingOffersStatus });
