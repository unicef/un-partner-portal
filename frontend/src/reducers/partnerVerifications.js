import { combineReducers } from 'redux';
import R from 'ramda';
import partnerVerificationsStatus, {
  loadPartnerVerificationsStarted,
  loadPartnerVerificationsEnded,
  loadPartnerVerificationsSuccess,
  loadPartnerVerificationsFailure,
  LOAD_PARTNER_VERIFICATIONS_SUCCESS,
} from './partnerVerificationStatus';
import {
  selectIndexWithDefaultEmptyObject,
} from './normalizationHelpers';

import { getPartnerVerifications, postPartnerVerifications } from '../helpers/api/api';

const initialState = {
};

const SINGLE_VERIFICATION_ADDED = 'SINGLE_VERIFICATION_ADDED';
const addSingleVerification = (partnerId, verification) =>
  ({ type: SINGLE_VERIFICATION_ADDED, partnerId, verification });

export const loadPartnerVerifications = id => (dispatch) => {
  dispatch(loadPartnerVerificationsStarted());
  return getPartnerVerifications(id)
    .then((response) => {
      dispatch(loadPartnerVerificationsEnded());
      dispatch(loadPartnerVerificationsSuccess(response.results, id, response.count - 1));
    })
    .catch((error) => {
      dispatch(loadPartnerVerificationsEnded());
      dispatch(loadPartnerVerificationsFailure(error));
    });
};

const saveVerifications = (state, action) => {
  const verifications = action.verifications;
  const mostRecentVerification = R.clone(selectIndexWithDefaultEmptyObject(0, verifications));
  return R.assoc(action.partnerId,
    { mostRecentVerification, verifications, previousCount: action.count },
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
  const { mostRecentVerification = [] } = mainVerif;
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
      dispatch(addSingleVerification(partnerId, newVerification));
      return newVerification;
    });

const partnerVerifications = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PARTNER_VERIFICATIONS_SUCCESS: {
      return saveVerifications(state, action);
    }
    case SINGLE_VERIFICATION_ADDED: {
      return saveSingleVerification(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: partnerVerifications, status: partnerVerificationsStatus });

