
import R from 'ramda';
import { LOAD_DETAILS_SUCCESS } from './partnerProfileDetailsStatus';
import { groupSpecializationsByCategory } from './partnerProfileDetails';

const initialState = {};

const flatSectorsAndAreas = (sectors, sectorsState) => sectors.map((sector) => {
  const sectorName = sectorsState.allSectors[sector.sector];
  const areasNames = sector.areas.map(
    area => sectorsState.allSpecializations[area]).join(', ');
  return `${sectorName}: ${areasNames}`;
});

const savePartnerProfileOverview = (state, action) => {
  const { partnerDetails, getState } = action;
  const wholeState = getState();
  const sectors = groupSpecializationsByCategory(partnerDetails.experiences);
  const profileOverview = {
    lastUpdate: '18 Sep 2017',
    name: R.prop('legal_name', partnerDetails),
    verified: true,
    partnerId: R.path(['profile', 'id'], partnerDetails),
    organisationType: R.prop('display_type', partnerDetails),
    operationCountry: wholeState.countries[R.path(['mailing_address', 'country'], partnerDetails)],
    location: R.path(['mailing_address', 'city'], partnerDetails),
    head: {
      firstName: R.path(['org_head', 'first_name'], partnerDetails),
      lastName: R.path(['org_head', 'last_name'], partnerDetails),
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
    yearOfEstablishment: R.path(['profile', 'registration_date'], partnerDetails),
    population: R.path(['mandate_mission', 'concern_groups'], partnerDetails).map(
      item => wholeState.population[item]),
    unExperience: (R.prop('collaborations_partnership', partnerDetails) || []).map(item => item.agency),
    budget: R.path(['budgets', '0', 'budget'], partnerDetails),
    keyResults: 'Yes',
    mandateMission: R.path(['mandate_mission', 'description'], partnerDetails),
  };
  return R.assoc(R.path(['profile', 'id'], partnerDetails), profileOverview, state);
};

export default function agencyPartnerProfileNavReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_DETAILS_SUCCESS: {
      return savePartnerProfileOverview(state, action);
    }
    default:
      return state;
  }
}
