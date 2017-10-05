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

const initialState = {
  identification: null,
  mailing_address: null,
  mandate_mission: null,
  fund: null,
  collaboration: null,
  project_impl: null,
  other_info: null,
};

export const loadPartnerDetails = partnerId => (dispatch) => {
  dispatch(loadDetailsStarted());
  return getPartnerProfileDetails(partnerId)
    .then((details) => {
      dispatch(loadDetailsEnded());
      dispatch(loadDetailsSuccess(details));
    })
    .catch((error) => {
      dispatch(loadDetailsEnded());
      dispatch(loadDetailsFailure(error));
    });
};

const extractSector = list => ({
  sector: list[0].specialization.category.id.toString(),
  areas: list.map(area => area.specialization.id.toString()),
  years: list[0].years });

const groupSpecializationsByCategory = R.compose(
  R.map(extractSector),
  R.groupWith((a, b) => equalAtPaths(['specialization', 'category', 'id'])),
);

const savePartnerProfileDetails = (state, action) => {
  const flatjson = flatten(action.partnerDetails);

  const mappedFields = R.mapObjIndexed((value, key) =>
    mapJsonSteps(key, value, flatjson), detailsStructure);

  const mappedSectors =
  groupSpecializationsByCategory(mappedFields.mandate_mission.experience.experiences);

  const mergedExperiences = R.assoc('specializations',
    mappedSectors, mappedFields.mandate_mission.experience);

  const mergedManadateMission = R.assoc('experience', mergedExperiences, mappedFields.mandate_mission);

  return R.assoc('mandate_mission', mergedManadateMission, mappedFields);
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

