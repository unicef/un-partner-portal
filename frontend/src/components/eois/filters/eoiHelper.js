import { browserHistory as history } from 'react-router';

const resetChanges = (pathName, query) => {
  const { page_size } = query;

  history.push({
    pathname: pathName,
    query: { page: 1, page_size },
  });

  return { page: 1, page_size };
};

export default resetChanges;
