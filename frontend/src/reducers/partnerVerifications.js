import { combineReducers } from 'redux';
import R from 'ramda';
import {
  selectIndexWithDefaultEmptyObject,
} from './normalizationHelpers';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, { success } from './apiMeta';
import { loadPartnerDetails } from './partnerProfileDetails';

import { getPartnerVerifications, postPartnerVerifications } from '../helpers/api/api';

const initialState = {
};

const SINGLE_VERIFICATION_ADDED = 'SINGLE_VERIFICATION_ADDED';

const errorMsg = 'Couldn\'t load partner verifications, ' +
'please refresh page and try again';

const PARTNER_VERIFICATIONS = 'PARTNER_VERIFICATIONS';
const tag = 'partnerVerifications';

export const loadPartnerVerifications = (id, params) => sendRequest({
  loadFunction: getPartnerVerifications,
  meta: {
    reducerTag: tag,
    actionTag: PARTNER_VERIFICATIONS,
    isPaginated: true,
  },
  successParams: { partnerId: id },
  errorHandling: { userMessage: errorMsg },
  apiParams: [id, params],
});

const saveVerifications = (state, action) => {
  const verifications = action.results;
  const mostRecentVerification = R.clone(selectIndexWithDefaultEmptyObject(0, verifications));
  return R.assoc(action.partnerId,
    { mostRecentVerification, verifications, previousCount: action.count - 1 },
    state);
};

const saveSingleVerification = (state, action) => {
  const verification = action.verification;
  let currentVerifications = state[action.partnerId].verifications;
  currentVerifications = R.prepend(verification, currentVerifications);
  return R.assoc(action.partnerId,
    { mostRecentVerification: verification,
      verifications: currentVerifications,
      previousCount: state[action.partnerId].previousCount,
    },
    state);
};

export const selectVerifications = (state, partnerId) => {
  const mainVerif = selectIndexWithDefaultEmptyObject(partnerId, state.data);
  const { verifications = [] } = mainVerif;
  return R.drop(1, verifications);
};

export const selectMostRecentVerification = (state, partnerId) => {
  const mainVerif = selectIndexWithDefaultEmptyObject(partnerId, state.data);
  const { mostRecentVerification = {} } = mainVerif;

  return mostRecentVerification;
};

export const selectPreviousVerificationsCount = (state, partnerId) => {
  const mainVerif = selectIndexWithDefaultEmptyObject(partnerId, state.data);
  const { previousCount = 0 } = mainVerif;
  return previousCount;
};

export const updatePartnerVerifications = (partnerId, body) =>
  dispatch => postPartnerVerifications(partnerId, body)
    .then((newVerification) => {
      dispatch(loadPartnerVerifications(partnerId));
      dispatch(loadPartnerDetails(partnerId));
      return newVerification;
    });

const partnerVerifications = (state = initialState, action) => {
  switch (action.type) {
    case success`${PARTNER_VERIFICATIONS}`: {
      return saveVerifications(state, action);
    }
    case SINGLE_VERIFICATION_ADDED: {
      return saveSingleVerification(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: partnerVerifications,
  status: apiMeta(PARTNER_VERIFICATIONS) });

