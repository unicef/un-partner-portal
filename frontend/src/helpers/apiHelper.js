/* eslint-disable react/prop-types */
/* eslint-disable import/prefer-default-export */
import R from 'ramda';
import { browserHistory as history } from 'react-router';

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

export const updatePageNumber = (pageNumber, pathName, query) => {
  history.push({
    pathname: pathName,
    query: R.merge(query, { page: pageNumber + 1 }),
  });
};
