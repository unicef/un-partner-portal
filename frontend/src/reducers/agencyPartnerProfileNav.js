
import { SESSION_INIT } from './session';

const initialState = {
  partnerProfile: {
    name: 'Partner 0',
    verified: false,
    partnerId: 1112321,
    organisationType: 'International NGO',
    operationCountry: 'England',
    location: 'London',
    head: {
      firstName: 'Barbara',
      lastname: 'Smith',
      title: 'Head of organization',
      telephone: '1 092 123 213',
      mobile: '1 232 123 999',
      fax: '1 092 421 213',
      email: 'barbara.smith@email.org',
    },
    contact: '34th Sunny Stree, London, phone: 834 231 213',
    sectors: ['Area 1', 'Area 2'],
    population: 'Children',
    experience: '1 year',
    unExperience: 'WFP',
    budget: 150000,
    keyResults: true,
    mandateMission: 'This a brief statement of Mandate and Mission of my organization.',
  },
  tabs: [
    { path: '/partner/info/overview', label: 'Overview', name: 'a' },
    { path: '/partner/info/details', label: 'Profile details', name: 'a' },
    { path: '/partner/info/users', label: 'Users', name: 'a' },
    { path: '/partner/info/applications', label: 'Applications', name: 'a' },
  ],
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
