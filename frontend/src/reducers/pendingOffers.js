import { combineReducers } from 'redux';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, { success } from './apiMeta';
import { normalizeSingleCfei } from './cfei';

import { getPendingOffers } from '../helpers/api/api';

const initialState = {
  applications: [],
  count: 0,
};

const errorMsg = 'Couldn\'t load pending offers, ' +
  'please refresh page and try again';

const PENDING_OFFERS = 'PENDING_OFFERS';
const tag = 'pendingOffers';

export const loadPendingOffers = params => sendRequest({
  loadFunction: getPendingOffers,
  meta: {
    reducerTag: tag,
    actionTag: PENDING_OFFERS,
    isPaginated: true,
  },
  errorHandling: { userMessage: errorMsg },
  apiParams: [params],
});

export const savePendingOffers = (action) => {
  const { results, count } = action;
  const newPendingOffers = results.map(normalizeSingleCfei);
  return { pendingOffers: newPendingOffers, count };
};

const PendingOffers = (state = initialState, action) => {
  switch (action.type) {
    case success`${PENDING_OFFERS}`: {
      return savePendingOffers(action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: PendingOffers, status: apiMeta(PENDING_OFFERS) });
