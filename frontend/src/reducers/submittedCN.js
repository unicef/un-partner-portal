import { combineReducers } from 'redux';
import { normalizeSingleCfei } from './cfei';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, {
  success,
} from './apiMeta';
import { getSubmittedCN } from '../helpers/api/api';

const errorMessage = 'Couldn\'t load submitted CN, please refresh page and try again';

const SUBMITTED_CN = 'SUBMITTED_CN';
const tag = 'submittedCN';

const initialState = {
  applications: [],
  count: 0,
};

export const loadSubmittedCN = params => sendRequest({
  loadFunction: getSubmittedCN,
  meta: {
    reducerTag: tag,
    actionTag: SUBMITTED_CN,
    isPaginated: true,
  },
  errorHandling: { userMessage: errorMessage },
  apiParams: [params],
});

export const saveSubmittedCN = (action) => {
  const { results: cfei, count } = action;
  const newSubmittedCN = cfei.map(normalizeSingleCfei);
  return { submittedCN: newSubmittedCN, count };
};

const submittedCN = (state = initialState, action) => {
  switch (action.type) {
    case success`${SUBMITTED_CN}`: {
      return saveSubmittedCN(action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: submittedCN, status: apiMeta(SUBMITTED_CN) });
