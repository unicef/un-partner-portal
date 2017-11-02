import { combineReducers } from 'redux';
import R from 'ramda';
import PartnerFlagsStatus, {
  loadPartnerFlagsStarted,
  loadPartnerFlagsEnded,
  loadPartnerFlagsSuccess,
  loadPartnerFlagsFailure,
  LOAD_PARTNERS_FLAGS_SUCCESS,
} from './partnerFlagsStatus';
import { selectIndexWithDefaultEmptyObject } from './normalizationHelpers';
import { getPartnerFlags, postPartnerFlags, patchPartnerFlags } from '../helpers/api/api';

const initialState = {};

export const loadPartnerFlags = (partnerId, params) => (dispatch) => {
  dispatch(loadPartnerFlagsStarted());
  return getPartnerFlags(partnerId, params)
    .then(({ results, count }) => {
      dispatch(loadPartnerFlagsEnded());
      dispatch(loadPartnerFlagsSuccess(results, partnerId, count));
      return results;
    })
    .catch((error) => {
      dispatch(loadPartnerFlagsEnded());
      dispatch(loadPartnerFlagsFailure(error));
    });
};

export const updatePartnerFlags = (partnerId, body, edit) => (dispatch) => {
  const method = edit ? patchPartnerFlags : postPartnerFlags;
  return method(partnerId, body)
    .then((flag) => {
      dispatch(loadPartnerFlags(partnerId));
      return flag;
    });
};

const savePartnerFlags = (state, action) =>
  R.assoc(action.partnerId, { flags: action.flags, count: action.count }, state);

export const selectPartnerFlags = (state, partnerId) => {
  const { flags = [] } = selectIndexWithDefaultEmptyObject(partnerId, state.data);
  return flags;
};

export const selectPartnerFlagsCount = (state, partnerId) => {
  const { count = 0 } = selectIndexWithDefaultEmptyObject(partnerId, state.data);
  return count;
};

const PartnerFlags = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PARTNERS_FLAGS_SUCCESS: {
      return savePartnerFlags(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: PartnerFlags, status: PartnerFlagsStatus });
