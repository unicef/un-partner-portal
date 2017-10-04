
import R from 'ramda';
import { LOAD_DETAILS_SUCCESS } from './partnerProfileDetailsStatus';

const mockData = {
  lastUpdate: '18 Sep 2017',
  name: 'Partner 0',
  verified: true,
  partnerId: 1112321,
  organisationType: 'International NGO',
  operationCountry: 'England',
  location: 'London',
  head: {
    firstName: 'Barbara',
    lastName: 'Smith',
    title: 'Head of organization',
    telephone: '1 092 123 213',
    mobile: '1 232 123 999',
    fax: '1 092 421 213',
    email: 'barbara.smith@email.org',
  },
  contact: '34th Sunny Stree So Long On the 5th Avenue, London , phone: 834 231 213',
  sectors: ['Area 1', 'Area 2'],
  population: 'Children',
  experience: '1 year',
  unExperience: 'WFP',
  budget: 150000,
  keyResults: true,
  mandateMission: 'This a brief statement of Mandate and Mission of my organization.',
};

const initialState = {
  1: mockData,
};

const savePartnerProfileOverview = (state, action) => {
  const { partnerDetails } = action;
  const profileOverview = {
    lastUpdate: '18 Sep 2017',
    name: R.prop('legal_name', partnerDetails),
    verified: true,
    partnerId: R.path(['profile', 'id'], partnerDetails),
    organisationType: R.prop('display_type', partnerDetails),
    operationCountry: R.path(['mailing_address', 'country'], partnerDetails),
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
    sectors: ['Area 1', 'Area 2'],
    population: R.path(['mandate_mission', 'concern_groups'], partnerDetails),
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
