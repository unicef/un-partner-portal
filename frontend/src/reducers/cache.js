import R from 'ramda';
import { combineReducers } from 'redux';

export const AMEND_PARTNERS_CACHE = 'AMEND_PARTNERS_CACHE';
export const CLEAR_PARTNERS_CACHE = 'CLEAR_PARTNERS_CACHE';

export const clearPartnersCache = () => ({ type: CLEAR_PARTNERS_CACHE });
export const amendPartnersCache = (payload) => ({ type: AMEND_PARTNERS_CACHE, payload });

export default combineReducers({
  partners(state = [], { type, payload }) {
    switch (type) {
      case CLEAR_PARTNERS_CACHE:
        return [];

      case AMEND_PARTNERS_CACHE:
        return R.unionWith(R.eqBy(R.prop('id')), state, payload);

      default:
        return state;
    }
  },
})
