import R from 'ramda';
import { postOpenCfei } from '../helpers/api/api';

export const NEW_CFEI_SUBMITTING = 'NEW_CFEI_SUBMITTING';
export const NEW_CFEI_SUBMITTED = 'NEW_CFEI_SUBMITTED';
export const NEW_CFEI_PROCESSED = 'NEW_CFEI_PROCESSED';
export const NEW_CFEI_PROCESSING = 'NEW_CFEI_PROCESSING';
export const NEW_CFEI_FAILURE = 'NEW_CFEI_FAILURE';


const messages = {
  postOpenFailure: 'Unfortunately, couldn\'t create new Cfei',
};

const mockData = {
  eoi: {
    locations: [
      {
        country_code: 'IQ',
        admin_level_1: { name: 'Baghdad' },
        lat: 159,
        lon: 130,
      },
      {
        country_code: 'FR',
        admin_level_1: { name: 'Paris' },
        lat: 120,
        lon: 19,
      },
    ],
    specializations: [1, 2],
    country_code: 'PL',
    agency: 1,
    agency_office: 1,
  },
  assessment_criterias: [
    {
      display_type: 'SEE',
      scale: 'Std',
      weight: 50,
      description: 'test',
    },
  ],
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

export const addOpenCfei = (dispatch, body) => {
  dispatch(newCfeiSubmitting());
  postOpenCfei(R.mergeWith(R.merge, body, mockData));
  new Promise(resolve =>
    setTimeout(resolve, 5000))
    .then(() => {
      dispatch(newCfeiSubmitted());
      dispatch(newCfeiProcessing());
    });
  //   .then(() => {
  //     dispatch(newCfeiSubmitted());
  //     dispatch(newCfeiProcessing());
  //   })
  //   .catch((error) => {
  //     dispatch(newCfeiSubmitted());
  //     dispatch(newCfeiFailure(error));
  //   });
};

export const addDirectCfei = () => {
  new Promise(resolve =>
    setTimeout(resolve, 3000))
    .then(() => console.log('New direct selection created'));
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
