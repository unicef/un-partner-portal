import { combineReducers } from 'redux';
import R from 'ramda';
import cfeiDetailsStatus, {
  loadCfeiDetailStarted,
  loadCfeiDetailEnded,
  loadCfeiDetailSuccess,
  loadCfeiDetailFailure,
  LOAD_CFEI_DETAIL_SUCCESS,
} from './cfeiDetailsStatus';
import { } from './apiStatus';
import { normalizeSingleCfei } from './cfei';
import { getOpenCfeiDetails } from '../helpers/api/api';

const mockData = {
  eoi: {
    id: 13,
    locations: [
      {
        id: 1,
        admin_level_1: {
          id: 1,
          name: 'Baghdad',
        },
        country_code: 'IQ',
        lat: '159.00000',
        lon: '130.00000',
      },
      {
        id: 2,
        admin_level_1: {
          id: 2,
          name: 'Paris',
        },
        country_code: 'FR',
        lat: '120.00000',
        lon: '19.00000',
      },
    ],
    display_type: 'Ope',
    status: 'Ope',
    title: 'title',
    country_code: 'PL',
    description: 'background',
    other_information: null,
    start_date: '2017-09-30',
    end_date: '2017-09-17',
    deadline_date: '2017-09-16',
    posted_date: '2017-08-17',
    notif_results_date: '2017-09-20',
    has_weighting: true,
    closed_justification: null,
    goal: 'Nothing',
    agency: 1,
    created_by: 1,
    focal_point: 2,
    agency_office: 1,
    specializations: [
      {
        sector: '12',
        areas: [
          '69',
          '70',
        ],
      },
      {
        sector: '5',
        areas: [
          '28',
        ],
      },
    ],
  },
  assessment_criterias: [
    {
      id: 5,
      created: '2017-09-05T02:48:31.614474',
      modified: '2017-09-05T02:48:31.614709',
      display_type: 'SEE',
      scale: 'Std',
      weight: 50,
      description: 'test',
    },
  ],
};

const initialState = {
  13: mockData,
};

export const loadCfei = (project, filters) => (dispatch, getState) => {
  dispatch(loadCfeiDetailStarted());
  return getOpenCfeiDetails(project, filters)
    .then((cfei) => {
      dispatch(loadCfeiDetailEnded());
      dispatch(loadCfeiDetailSuccess(cfei.results, project, getState));
    })
    .catch((error) => {
      dispatch(loadCfeiDetailEnded());
      dispatch(loadCfeiDetailFailure(error));
    });
};

const saveCfei = (state, action) => {
  const cfei = normalizeSingleCfei(action.cfei, action.getState);
  return R.assoc(cfei.id, cfei, state);
};

export function selectCfeiDetail(state, id) {
  return state[id] ? state[id] : null;
}

export function selectCfeiTitle(state, id) {
  return state[id] ? state[id].eoi.title : null;
}

const cfeiDetails = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CFEI_DETAIL_SUCCESS: {
      return saveCfei(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ cfeiDetails, cfeiDetailsStatus });
