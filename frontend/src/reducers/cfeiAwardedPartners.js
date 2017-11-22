import { combineReducers } from 'redux';
import R from 'ramda';
import cfeiAwardedPartnersStatus, {
  loadCfeiAwardedPartnersStarted,
  loadCfeiAwardedPartnersEnded,
  loadCfeiAwardedPartnersSuccess,
  loadCfeiAwardedPartnersFailure,
  LOAD_CFEI_AWARDED_PARTNERS_SUCCESS,
} from './cfeiAwardedPartnersStatus';
import { selectIndexWithDefaultEmptyArray, pickByMap } from './normalizationHelpers';
import {
  loadApplicationDetailSuccess,
} from './applicationDetailsStatus';
import { getCfeiAwardedPartners } from '../helpers/api/api';


const initialState = {};

export const loadAwardedPartners = cfeiId => (dispatch, getState) => {
  dispatch(loadCfeiAwardedPartnersStarted());
  return getCfeiAwardedPartners(cfeiId)
    .then((awardedPartners) => {
      dispatch(loadCfeiAwardedPartnersEnded());
      dispatch(loadCfeiAwardedPartnersSuccess(awardedPartners, cfeiId));
      awardedPartners.forEach((awardedPartner) => {
        dispatch(loadApplicationDetailSuccess(pickByMap({
          id: 'application_id',
          did_accept: 'did_accept',
          did_decline: 'did_decline',
          did_win: 'did_win',
          did_withdraw: 'did_withdraw',
          withdraw_reason: 'withdraw_reason',
        }, awardedPartner), getState));
      });
      return awardedPartners;
    })
    .catch((error) => {
      dispatch(loadCfeiAwardedPartnersEnded());
      dispatch(loadCfeiAwardedPartnersFailure(error));
    });
};

const saveAwardedPartners = (state, action) =>
  R.assoc(action.id, action.awardedPartners, state);

export function selectAwardedPartners(state, cfeiId) {
  return selectIndexWithDefaultEmptyArray(cfeiId, state);
}

const cfeiAwardedPartners = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CFEI_AWARDED_PARTNERS_SUCCESS: {
      return saveAwardedPartners(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: cfeiAwardedPartners, status: cfeiAwardedPartnersStatus });
