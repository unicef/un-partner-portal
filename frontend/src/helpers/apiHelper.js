/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
import R from 'ramda';
import { browserHistory as history } from 'react-router';
import { isCancel, CancelToken } from 'axios';
import {
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from '../reducers/apiMeta';
import { errorToBeAdded } from '../reducers/errorReducer';

const errorHandler = R.curry(errorToBeAdded);

export const isQueryChanged = (nextProps, query) =>
  (!R.isEmpty(nextProps.location.query) && !R.equals(query, nextProps.location.query));

export const calculatePaginatedPage = (pageNumber, pageSize, itemsCount) => {
  const totalPages = Math.ceil(itemsCount / pageSize);
  return Math.min(pageNumber, totalPages - 1);
};

export const updatePageNumberSize = (pageNumber, pageSize, pathName, query) => {
  history.push({
    pathname: pathName,
    query: R.merge(query, { page: pageNumber + 1, page_size: pageSize }),
  });
};

export const updateOrder = (column, direction, pathName, query) => {
  history.push({
    pathname: pathName,
    query: R.merge(query, { ordering: direction + column }),
  });
};

export const updatePageNumber = (pageNumber, pathName, query) => {
  history.push({
    pathname: pathName,
    query: R.merge(query, { page: pageNumber + 1 }),
  });
};

export const changedValues = (initialValues, values) => {
  const diffFields = R.mapObjIndexed((num, key, obj) => R.equals(values[key], obj[key]), initialValues);
  const filtered = R.keys(R.filter((item) => { if (!item) return !item; }, diffFields));
  const merged = R.mergeAll(R.map(item => R.objOf(item, values[item]), filtered));

  return merged;
};

export const getNewRequestToken = (getState, name) => {
  const currentCancelToken = R.path([name, 'status', 'cancelToken'], getState());
  if (currentCancelToken) {
    currentCancelToken.cancel();
  }
  return CancelToken.source();
};

export const sendRequest = ({
  loadFunction,
  meta: {
    reducerTag,
    actionTag,
    isPaginated = false,
  },
  successParams = {},
  errorHandling: {
    userMessage = '',
    id = 'generic',
    additionalErrors,
  } = {},
  apiParams = [],
},
) => (dispatch, getState) => {
  // export const loadCfei = (project, filters) => (dispatch, getState) => {
  const newCancelToken = getNewRequestToken(getState, reducerTag);
  dispatch(loadStarted(actionTag, newCancelToken));
  return loadFunction(...apiParams, { cancelToken: newCancelToken.token })
    .then((response) => {
      dispatch(loadEnded(actionTag));
      if (isPaginated) {
        const results = response.results;
        const count = response.count;
        dispatch(loadSuccess(actionTag, { results, count, ...successParams, getState }));
        return results;
      }
      dispatch(loadSuccess(actionTag, { results: response, ...successParams, getState }));
      return response;
    })
    .catch((error) => {
      if (!isCancel(error)) {
        dispatch(loadEnded(actionTag));
        dispatch(errorHandler(error, id || reducerTag, userMessage));
        if (additionalErrors) dispatch(loadFailure(additionalErrors(error)));
      }
    });
};
