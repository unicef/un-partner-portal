import R from 'ramda';
import { patchPartnerProfileTab } from '../helpers/api/api';

export const PATCH_DETAILS_STARTED = 'PATCH_DETAILS_STARTED';
export const PATCH_DETAILS_ENDED = 'PATCH_DETAILS_ENDED';
export const PATCH_DETAILS_SUCCESS = 'PATCH_DETAILS_SUCCESS';
export const PATCH_DETAILS_FAILURE = 'PATCH_DETAILS_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load partner profile details.',
};

const startLoading = state => R.assoc('error', {}, R.assoc('loading', true, state));
const stopLoading = state => R.assoc('loading', false, state);
const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error,
  },
  state);

export const patchDetailsStarted = () => ({ type: PATCH_DETAILS_STARTED });
export const patchDetailsEnded = () => ({ type: PATCH_DETAILS_ENDED });
export const patchDetailsSuccess = (partnerDetails, getState) =>
  ({ type: PATCH_DETAILS_SUCCESS, partnerDetails, getState });
export const patchDetailsFailure = error => ({ type: PATCH_DETAILS_FAILURE, error });

export const patchPartnerProfile = (partnerId, tabName, body) => (dispatch) => {
  dispatch(patchDetailsStarted());

  return patchPartnerProfileTab(partnerId, tabName, body);
};

export default function partnerProfileDetailsStatus(state = initialState, action) {
  switch (action.type) {
    case PATCH_DETAILS_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case PATCH_DETAILS_STARTED: {
      return startLoading(state);
    }
    case PATCH_DETAILS_ENDED: {
      return stopLoading(state);
    }
    default:
      return state;
  }
}
