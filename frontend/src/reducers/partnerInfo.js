
import { SESSION_INIT } from './session';

const mockData = {
  lastUpdate: '18 Sep 2017',
  name: 'Partner 0',
  verified: true,
  partnerId: 1112321,
  organisationType: 'International NGO',
  operationCountry: 'England',
  location: 'London',
};

const initialState = {
  partner: mockData,
};

export default function partnerInfoReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_INIT: {
      return state;
    }
    default:
      return state;
  }
}
