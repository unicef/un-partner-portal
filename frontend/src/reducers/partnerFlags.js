import { combineReducers } from 'redux';
import R from 'ramda';
import { selectIndexWithDefaultEmptyObject } from './normalizationHelpers';
import { getPartnerFlags, postPartnerFlags, patchPartnerFlags } from '../helpers/api/api';
import { loadPartnerProfileSummary } from './agencyPartnerProfile';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, { success } from './apiMeta';

const initialState = {};

const errorMsg = 'Couldn\'t load flag details, ' +
  'please refresh page and try again';

const PARTNER_FLAGS = 'PARTNER_FLAGS';
const tag = 'partnerFlags';

export const loadPartnerFlags = (partnerId, params) => sendRequest({
  loadFunction: getPartnerFlags,
  meta: {
    reducerTag: tag,
    actionTag: PARTNER_FLAGS,
    isPaginated: true,
  },
  successParams: { partnerId },
  errorHandling: { userMessage: errorMsg },
  apiParams: [partnerId, params],
});

export const updatePartnerFlags = (partnerId, body, edit, flagId) => (dispatch) => {
  const method = edit ? patchPartnerFlags : postPartnerFlags;
  return method(partnerId, body, flagId)
    .then((flag) => {
      dispatch(loadPartnerFlags(partnerId));
      dispatch(loadPartnerProfileSummary(partnerId));
      return flag;
    });
};

const savePartnerFlags = (state, action) =>
  R.assoc(action.partnerId, { flags: action.results, count: action.count }, state);

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
    case success`${PARTNER_FLAGS}`: {
      return savePartnerFlags(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: PartnerFlags, status: apiMeta(PARTNER_FLAGS) });
