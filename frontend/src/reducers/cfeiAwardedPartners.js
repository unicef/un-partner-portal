import { combineReducers } from 'redux';
import R from 'ramda';
import cfeiAwardedPartnersStatus, {
  loadCfeiAwardedPartnersStarted,
  loadCfeiAwardedPartnersEnded,
  loadCfeiAwardedPartnersSuccess,
  loadCfeiAwardedPartnersFailure,
  LOAD_CFEI_AWARDED_PARTNERS_SUCCESS,
} from './cfeiAwardedPartnersStatus';
import { selectIndexWithDefaultEmptyArray } from './normalizationHelpers';
import { getCfeiAwardedPartners } from '../helpers/api/api';

const initialState = {};

export const loadAwardedPartners = cfeiId => (dispatch) => {
  dispatch(loadCfeiAwardedPartnersStarted());
  return getCfeiAwardedPartners(cfeiId)
    .then((awardedPartners) => {
      dispatch(loadCfeiAwardedPartnersEnded());
      dispatch(loadCfeiAwardedPartnersSuccess(awardedPartners, cfeiId));
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
