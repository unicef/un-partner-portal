import { browserHistory as history } from 'react-router';

const resetChanges = (pathName) => {
  history.push({
    pathname: pathName,
    query: { page: 1, page_size: 10 },
  });

  return { page: 1, page_size: 10 };
};

export default resetChanges;
