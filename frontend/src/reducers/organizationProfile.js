
import { SESSION_INIT } from './session';

const hqProfile = {
  name: 'Hq Profile',
  lastUpdate: '12 Aug 2017',
};

const countryProfile = {
  name: 'Kenya',
  lastUpdate: '10 Sep 2017',
};

const initialState = {
  hq: hqProfile,
  1: countryProfile,
};

export default function organizationProfileReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_INIT: {
      return state;
    }
    default:
      return state;
  }
}
