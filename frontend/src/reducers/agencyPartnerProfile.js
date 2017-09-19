
import { SESSION_INIT } from './session';

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

export default function agencyPartnerProfileNavReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_INIT: {
      return state;
    }
    default:
      return state;
  }
}
