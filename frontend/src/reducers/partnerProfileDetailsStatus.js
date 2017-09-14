import R from 'ramda';

export const LOAD_DETAILS_STARTED = 'LOAD_DETAILS_STARTED';
export const LOAD_DETAILS_ENDED = 'LOAD_DETAILS_ENDED';
export const LOAD_DETAILS_SUCCESS = 'LOAD_DETAILS_SUCCESS';
export const LOAD_DETAILS_FAILURE = 'LOAD_DETAILS_FAILURE';

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

export const loadDetailsStarted = () => ({ type: LOAD_DETAILS_STARTED });
export const loadDetailsEnded = () => ({ type: LOAD_DETAILS_ENDED });
export const loadDetailsSuccess = partnerDetails =>
  ({ type: LOAD_DETAILS_SUCCESS, partnerDetails });
export const loadDetailsFailure = error => ({ type: LOAD_DETAILS_FAILURE, error });

export default function cfeiStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_DETAILS_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_DETAILS_STARTED: {
      return startLoading(state);
    }
    case LOAD_DETAILS_ENDED: {
      return stopLoading(state);
    }
    default:
      return state;
  }
}
