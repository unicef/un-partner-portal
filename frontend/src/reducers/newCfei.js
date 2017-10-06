import R from 'ramda';
import { postOpenCfei, postDirectCfei, patchCfei } from '../helpers/api/api';
import { mergeListsFromObjectArray } from './normalizationHelpers';
import { loadCfei } from './cfei';
import { loadCfeiDetailSuccess } from './cfeiDetailsStatus';
import { PROJECT_TYPES } from '../helpers/constants';

export const NEW_CFEI_SUBMITTING = 'NEW_CFEI_SUBMITTING';
export const NEW_CFEI_SUBMITTED = 'NEW_CFEI_SUBMITTED';
export const NEW_CFEI_PROCESSED = 'NEW_CFEI_PROCESSED';
export const NEW_CFEI_PROCESSING = 'NEW_CFEI_PROCESSING';
export const NEW_CFEI_FAILURE = 'NEW_CFEI_FAILURE';


const messages = {
  postOpenFailure: 'Unfortunately, couldn\'t create new Cfei',
};

const mockData = {
  agency: 1,
  agency_office: 1,
};

const initialState = {
  openCfeiSubmitting: false,
  openCfeiProcessing: false,
  error: {},
};

export const newCfeiSubmitting = () => ({ type: NEW_CFEI_SUBMITTING });
export const newCfeiSubmitted = () => ({ type: NEW_CFEI_SUBMITTED });
export const newCfeiProcessing = () => ({ type: NEW_CFEI_PROCESSING });
export const newCfeiProcessed = () => ({ type: NEW_CFEI_PROCESSED });
export const newCfeiFailure = () => ({ type: NEW_CFEI_FAILURE });

const prepareBody = (body) => {
  let newBody = R.clone(body);
  const flatSectors = mergeListsFromObjectArray(newBody.specializations, 'areas');
  newBody = R.assoc('specializations', flatSectors, body);
  newBody = R.assoc('country_code', body.countries[0].country, newBody);
  newBody = R.assoc('locations',
    R.reduce(
      R.mergeDeepWith(R.concat),
      0,
      body.countries,
    ).locations, newBody);
  return newBody;
};

export const addOpenCfei = body => (dispatch) => {
  dispatch(newCfeiSubmitting());
  const preparedBody = prepareBody(body);
  return postOpenCfei(R.mergeWith(R.merge, preparedBody, mockData))
    .then(() => {
      dispatch(newCfeiSubmitted());
      dispatch(newCfeiProcessing());
      dispatch(loadCfei(PROJECT_TYPES.OPEN));
    })
    .catch((error) => {
      dispatch(newCfeiSubmitted());
      dispatch(newCfeiFailure(error));
    });
};

export const addDirectCfei = body => (dispatch) => {
  dispatch(newCfeiSubmitting());
  const preparedBody = prepareBody(body);
  return postDirectCfei(R.mergeWith(R.merge, preparedBody, mockData))
    .then(() => {
      dispatch(newCfeiSubmitted());
      dispatch(loadCfei(PROJECT_TYPES.DIRECT));
    })
    .catch((error) => {
      dispatch(newCfeiSubmitted());
      dispatch(newCfeiFailure(error));
    });
};

export const updateCfei = (body, id) => (dispatch) => {
  dispatch(newCfeiSubmitting());
  return patchCfei(body, id)
    .then((cfei) => {
      dispatch(newCfeiSubmitted());
      dispatch(loadCfeiDetailSuccess(cfei));
    })
    .catch((error) => {
      dispatch(newCfeiSubmitted());
      dispatch(newCfeiFailure(error));
    });
};


const startSubmitting = state => R.assoc('error', {}, R.assoc('openCfeiSubmitting', true, state));
const stopSubmitting = state => R.assoc('openCfeiSubmitting', false, state);
const startProcessing = state => R.assoc('openCfeiProcessing', true, state);
const stopProcessing = state => R.assoc('openCfeiProcessing', false, state);
const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.postOpenFailure,
    error: action.error,
  },
  state);

export default function CfeiReducer(state = initialState, action) {
  switch (action.type) {
    case NEW_CFEI_SUBMITTING: {
      return startSubmitting(state);
    }
    case NEW_CFEI_SUBMITTED: {
      return stopSubmitting(state);
    }
    case NEW_CFEI_PROCESSING: {
      return startProcessing(state);
    }
    case NEW_CFEI_PROCESSED: {
      return stopProcessing(state);
    }
    case NEW_CFEI_FAILURE: {
      return saveErrorMsg(state, action);
    }
    default:
      return state;
  }
}
