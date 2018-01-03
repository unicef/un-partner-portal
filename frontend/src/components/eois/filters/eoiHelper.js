import { browserHistory as history } from 'react-router';

const resetChanges = (pathName, query) => {
  const { page_size = 10 } = query;

  history.push({
    pathname: pathName,
    search: `?page=1&page_size=${page_size}`,
  });

  return { page: 1, page_size };
};

export default resetChanges;
