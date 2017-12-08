import R from 'ramda';
import { combineReducers } from 'redux';
import { getPartnerProfileDetails } from '../helpers/api/api';
import { mapJsonSteps, flatten } from '../helpers/jsonMapper';
import detailsStatus, {
  loadDetailsStarted,
  loadDetailsSuccess,
  loadDetailsEnded,
  loadDetailsFailure,
  LOAD_DETAILS_SUCCESS } from './partnerProfileDetailsStatus';
import detailsStructure from './partnerProfileDetailsStructure';
import { equalAtPaths } from '../reducers/normalizationHelpers';
import { sessionChange } from './session';

const initialState = {
  identification: null,
  mailing_address: null,
  mandate_mission: null,
  fund: null,
  collaboration: null,
  project_impl: null,
  other_info: null,
};

export const loadPartnerDetails = partnerId => (dispatch, getState) => {
  const session = getState().session;

  dispatch(loadDetailsStarted());
  return getPartnerProfileDetails(partnerId)
    .then((details) => {
      dispatch(loadDetailsEnded());
      dispatch(loadDetailsSuccess(details, getState));

      if (session.partnerId === details.profile.id) {
        dispatch(sessionChange(R.assoc('isProfileComplete', details.is_finished, session)));
      }
    })
    .catch((error) => {
      dispatch(loadDetailsEnded());
      dispatch(loadDetailsFailure(error));
    });
};

const extractSector = list => ({
  sector: R.path(['specialization', 'category', 'id'], list[0]),
  areas: list.map(area => R.path(['specialization', 'id'], area)),
  years: list[0].years,
});

export const groupSpecializationsByCategory = R.compose(
  R.map(extractSector),
  R.groupWith(equalAtPaths(['specialization', 'category', 'id'])),
);

const normalizeSpecializations = (state) => {
  const experiences = R.assoc('specializations',
    groupSpecializationsByCategory(state.mandate_mission.experience.experiences),
    state.mandate_mission.experience);

  return R.assoc('experience', experiences, state.mandate_mission);
};

const normalizeCollaboration = (state) => {
  const types = [
    'Acc',
    'Ref',
  ];

  const filterType = type => R.filter(evidence =>
    evidence.mode === type, state.collaboration.collaboration_evidences);
  const normalizedArray = R.map(filterType, types);

  const mergedAccreditations = R.assocPath(['collaboration', 'accreditation', 'accreditations'], R.isEmpty(normalizedArray[0]) ? [{}] : normalizedArray[0], state);

  return R.assocPath(['collaboration', 'reference', 'references'], R.isEmpty(normalizedArray[1]) ? [{}] : normalizedArray[1], mergedAccreditations);
};

const savePartnerProfileDetails = (state, action) => {
  const flatjson = flatten(action.partnerDetails);

  const mappedFields = R.mapObjIndexed((value, key) =>
    mapJsonSteps(key, value, flatjson), detailsStructure);

  const normalizedSpecializations = R.assoc('mandate_mission', normalizeSpecializations(mappedFields), mappedFields);

  return normalizeCollaboration(normalizedSpecializations);
};


const partnerProfileDetails = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_DETAILS_SUCCESS: {
      return savePartnerProfileDetails(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ partnerProfileDetails, detailsStatus });

