import { browserHistory as history } from 'react-router';
import R from 'ramda';

const resetChanges = (pathName, query) => {
  const { title } = {};
  const { project_title } = {};
  const { agency } = {};
  const { active } = true;
  const { country_code } = {};
  const { specializations } = {};
  const { specialization } = {};
  const { posted_from_date } = {};
  const { selected_source } = {};
  const { posted_to_date } = {};
  const { locations } = {};
  const { ds_converted } = {};
  const { ordering } = {};

  history.push({
    pathname: pathName,
    query: R.merge(query, {
      ordering,
      project_title,
      title,
      agency,
      active,
      country_code,
      specialization,
      specializations,
      selected_source,
      posted_from_date,
      posted_to_date,
      locations,
      ds_converted }),
  });
};

export default resetChanges;
