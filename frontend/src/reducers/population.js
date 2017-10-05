import { LOAD_PARTNER_CONFIG_SUCCESS } from './partnerProfileConfig';

const initialState = {
  Sta: 'Stateless',
  Ast: 'Asylum seekers ',
  Int: 'Internally displaced persons',
  Ret: 'Returning',
  Hos: 'Host Country',
  Ref: 'Refugees',
};

export default function countriesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PARTNER_CONFIG_SUCCESS: {
      return action.config['population-of-concerns-groups'];
    }
    default:
      return state;
  }
}
