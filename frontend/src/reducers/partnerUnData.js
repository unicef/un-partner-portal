import R from 'ramda';
import { combineReducers } from 'redux';
import { fetchPartnerUnData } from '../helpers/api/api';
import apiMeta, {
  success,
  failure,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../reducers/apiMeta';

export const PARTNER_UN_DATA = 'PARTNER_UN_DATA';

const initialState = {
  data: {},
  error: {},
};

export const getPartnerUnData = (agencyId, partnerId) => (dispatch) => {
  dispatch(loadStarted(PARTNER_UN_DATA));
  return fetchPartnerUnData(agencyId, partnerId)
    .then((data) => {
      dispatch(loadEnded(PARTNER_UN_DATA));
      dispatch(loadSuccess(PARTNER_UN_DATA, { agencyId, data }));
      return data;
    })
    .catch((error) => {
      dispatch(loadEnded(PARTNER_UN_DATA));
      dispatch(loadFailure(PARTNER_UN_DATA, { error, agencyId }));
    });
};

const savePartnerData = (state, action) => R.assoc(action.agencyId, R.map((item) => {
  const columns = R.map(header => ({ name: R.replace(/ /g, '_', header.toLowerCase()), title: header }), item.header);

  return {
    title: item.title,
    columns,
    items: R.map(row =>
      R.reduce((acc, obj) =>
        R.assoc(columns[R.values(acc).length].name, obj, acc), [], row), item.rows),
    count: item.rows.length,
  };
}, action.data.tables), state);

const saveFailure = (state, action) => R.assocPath([action.agencyId], null, R.assocPath(['error', action.agencyId], action.error, state));

function partnerUnData(state = initialState, action) {
  switch (action && action.type) {
    case success`${PARTNER_UN_DATA}`: {
      return savePartnerData(state, action);
    }
    case failure`${PARTNER_UN_DATA}`: {
      return saveFailure(state, action.error);
    }
    default:
      return state;
  }
}

export default combineReducers({ data: partnerUnData,
  status: apiMeta(PARTNER_UN_DATA) });
