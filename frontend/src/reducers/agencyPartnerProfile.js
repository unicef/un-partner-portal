
import R from 'ramda';
import { combineReducers } from 'redux';
import { groupSpecializationsByCategory } from './partnerProfileDetails';
import { getPartnerProfileSummary } from '../helpers/api/api';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, {
  success,
} from './apiMeta';

const errorMessage = 'Couldn\' load partner summary, please refresh page and try again';
const initialState = {};

const PARTNER_SUMMARY = 'AGENCY_PARTNER_PROFILE';
const tag = 'agenncyPartnerProfile';

export const loadPartnerProfileSummary = id => sendRequest({
  loadFunction: getPartnerProfileSummary,
  meta: {
    reducerTag: tag,
    actionTag: PARTNER_SUMMARY,
    isPaginated: false,
  },
  errorHandling: { userMessage: errorMessage },
  apiParams: [id],
});

const flatSectorsAndAreas = (sectors, sectorsState) => sectors.map((sector) => {
  const sectorName = sectorsState.allSectors[sector.sector];
  const areasNames = sector.areas.map(
    area => sectorsState.allSpecializations[area]).join(', ');
  return `${sectorName}: ${areasNames}`;
});

const savePartnerProfileOverview = (state, action) => {
  const { results: partnerDetails, getState } = action;
  const wholeState = getState();

  const sectors = groupSpecializationsByCategory(partnerDetails.experiences);
  const profileOverview = {
    lastUpdate: '18 Sep 2017',
    name: R.prop('legal_name', partnerDetails),
    verified: R.path(['partner_additional', 'is_verified'], partnerDetails),
    partnerId: R.prop('id', partnerDetails),
    organisationType: R.path(['partnerProfileConfig', 'partner-type', R.prop(
      'display_type', partnerDetails)], wholeState),
    operationCountry: wholeState.countries[R.prop('country_code', partnerDetails)],
    location: R.prop('location_of_office', partnerDetails),
    head: {
      fullname: R.path(['org_head', 'fullname'], partnerDetails),
      title: R.path(['org_head', 'job_title'], partnerDetails),
      telephone: R.path(['org_head', 'telephone'], partnerDetails),
      mobile: R.path(['org_head', 'mobile'], partnerDetails),
      fax: R.path(['org_head', 'fax'], partnerDetails),
      email: R.path(['org_head', 'email'], partnerDetails),
    },
    contact: [
      `${R.path(['mailing_address', 'street'], partnerDetails)}, ` +
      `${R.path(['mailing_address', 'zip_code'], partnerDetails)} ` +
      `${R.path(['mailing_address', 'city'], partnerDetails)}`,
      `phone: ${R.path(['mailing_address', 'telephone'], partnerDetails)}`,
    ],
    sectors: flatSectorsAndAreas(sectors, wholeState.sectors),
    yearOfEstablishment: R.prop('year_establishment', partnerDetails),
    population: R.prop(['population_of_concern'], partnerDetails).map(
      item => wholeState.partnerProfileConfig['population-of-concern'][item]),
    unExperience: (R.prop('collaborations_partnership', partnerDetails) || []).map(item => item.agency.name),
    budget: R.path(['partnerProfileConfig', 'budget-choices', R.prop(['annual_budget'], partnerDetails)], wholeState),
    keyResults: R.prop('key_result', partnerDetails),
    mandateMission: R.prop('mandate_and_mission', partnerDetails),
    partnerStatus: R.prop('partner_additional', partnerDetails),
  };
  return R.assoc(R.prop('id', partnerDetails), profileOverview, state);
};

function agencyPartnerProfile(state = initialState, action) {
  switch (action.type) {
    case success`${PARTNER_SUMMARY}`: {
      return savePartnerProfileOverview(state, action);
    }
    default:
      return state;
  }
}

export default combineReducers({ data: agencyPartnerProfile, status: apiMeta(PARTNER_SUMMARY) });