import R from 'ramda';
import { browserHistory as history } from 'react-router';
import { SubmissionError } from 'redux-form';
import { postOpenCfei, postDirectCfei, patchCfei, postUnsolicitedCN, patchPinnedCfei } from '../helpers/api/api';
import { mergeListsFromObjectArray } from './normalizationHelpers';
import { loadCfei } from './cfei';
import { loadCfeiDetailSuccess } from './cfeiDetailsStatus';
import * as cfeiDetails from './cfeiDetails';
import { PROJECT_TYPES } from '../helpers/constants';
import { loadApplicationsUcn } from './applicationsUnsolicitedList';
import { errorToBeAdded } from './errorReducer';
import {
  loadSuccess,
} from './apiMeta';
import {
  APPLICATION_DETAILS,
} from './applicationDetails';

const errorMsg = 'Unable to update project';

export const NEW_CFEI_SUBMITTING = 'NEW_CFEI_SUBMITTING';
export const NEW_CFEI_SUBMITTED = 'NEW_CFEI_SUBMITTED';
export const NEW_CFEI_PROCESSED = 'NEW_CFEI_PROCESSED';
export const NEW_CFEI_PROCESSING = 'NEW_CFEI_PROCESSING';

const initialState = {
  openCfeiSubmitting: false,
  openCfeiProcessing: false,
  error: {},
};

export const newCfeiSubmitting = () => ({ type: NEW_CFEI_SUBMITTING });
export const newCfeiSubmitted = () => ({ type: NEW_CFEI_SUBMITTED });
export const newCfeiProcessing = () => ({ type: NEW_CFEI_PROCESSING });
export const newCfeiProcessed = () => ({ type: NEW_CFEI_PROCESSED });

const mergeLocations = (acc, next) => {
  if (!R.has('locations', next)) {
    const newNext = R.assoc('locations', [
      { admin_level_1:
        {
          name: next.country,
          country_code: next.country,
        },
      }], next);
    return R.mergeDeepWith(R.concat, acc, newNext);
  }

  return R.mergeDeepWith(R.concat, acc, next);
};

const prepareBody = (body) => {
  let newBody = R.clone(body);
  const flatSectors = mergeListsFromObjectArray(newBody.specializations, 'areas');
  newBody = R.assoc('specializations', flatSectors, body);
  newBody = R.assoc('country_code', body.countries.map(country => country.country), newBody);
  newBody = R.assoc('locations',
    R.reduce(
      mergeLocations,
      0,
      body.countries,
    ).locations, newBody);
  return newBody;
};

export const addOpenCfei = body => (dispatch, getState) => {
  dispatch(newCfeiSubmitting());
  const { agencyId, officeId } = getState().session;
  const preparedBody = prepareBody(body);
  const params = history.getCurrentLocation().query;
  return postOpenCfei(R.mergeWith(R.merge, preparedBody,
    { agency: agencyId, agency_office: officeId }))
    .then((cfei) => {
      dispatch(newCfeiSubmitted());
      dispatch(newCfeiProcessing());
      dispatch(loadCfei(PROJECT_TYPES.OPEN, params));
      return cfei;
    })
    .catch((error) => {
      dispatch(newCfeiSubmitted());
      throw error;
    });
};

export const addDirectCfei = body => (dispatch, getState) => {
  dispatch(newCfeiSubmitting());
  const { agencyId, officeId } = getState().session;
  const preparedBody = prepareBody(body);
  const { applications, ...other } = preparedBody;
  const finalBody = {
    applications,
    eoi: R.mergeWith(
      R.merge,
      { ...other },
      { agency: agencyId, agency_office: officeId },
    ),
  };
  const params = history.getCurrentLocation().query;
  return postDirectCfei(finalBody)
    .then((direct) => {
      dispatch(loadCfei(PROJECT_TYPES.DIRECT, params));
      return direct.eoi;
    });
};

export const addUnsolicitedCN = body => (dispatch) => {
  dispatch(newCfeiSubmitting());
  const preparedBody = prepareBody(body);
  const params = history.getCurrentLocation().query;
  return postUnsolicitedCN(preparedBody)
    .then((unsolicited) => {
      dispatch(newCfeiSubmitted());
      dispatch(loadApplicationsUcn(params));
      return unsolicited;
    });
};

export const updateCfei = (body, id) => (dispatch, getState) => patchCfei(body, id)
  .then((cfei) => {
    dispatch(loadCfeiDetailSuccess(cfei));
    if (cfei.direct_selected_partners) {
      cfei.direct_selected_partners.forEach((selectedPartner) => {
        dispatch(loadSuccess(APPLICATION_DETAILS, { results: {
          id: selectedPartner.id,
          application_status: selectedPartner.application_status,
        },
        selectedPartner,
        getState }));
      });
    }
  }).catch((error) => {
    dispatch(errorToBeAdded(error, 'cfeiUpdate', errorMsg));
    throw new SubmissionError({
      ...error.response.data,
      _error: errorMsg,
    });
  });

export const changePinStatusCfei = (id, isPinned) => dispatch =>
  patchPinnedCfei({
    eoi_ids: [id],
    pin: !isPinned,
  })
    .then(() => {
      dispatch(cfeiDetails.loadCfei(id));
    }).catch((error) => {
      dispatch(errorToBeAdded(error, 'cfeiUpdate', errorMsg));
    });


const startSubmitting = state => R.assoc('error', {}, R.assoc('openCfeiSubmitting', true, state));
const stopSubmitting = state => R.assoc('openCfeiSubmitting', false, state);
const startProcessing = state => R.assoc('openCfeiProcessing', true, state);
const stopProcessing = state => R.assoc('openCfeiProcessing', false, state);

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
    default:
      return state;
  }
}
