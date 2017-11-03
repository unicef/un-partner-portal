import { browserHistory as history } from 'react-router';
import R from 'ramda';

const resetChanges = (pathName, query) => {
  const { page } = query;
  const { page_size } = query;

  history.push({
    pathname: pathName,
    query: { page, page_size },
  });
};

export default resetChanges;
