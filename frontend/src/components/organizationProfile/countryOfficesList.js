import React from 'react';
import PropTypes from 'prop-types';
import HeaderList from '../../components/common/list/headerList';
import OrganizationItem from './organizationItem';
import CountryOfficesHeaderContainer from './countryOfficesHeaderContainer';

const countryOfficesItems = profiles => profiles.map(item =>
  (<OrganizationItem
    isCountryItem
    profileId={item.id}
    title={item.country_code}
    users={item.users}
    completed={item.completed}
  />));

const CountryOfficesList = (props) => {
  const { profiles } = props;

  return (<HeaderList
    header={<CountryOfficesHeaderContainer />}
    rows={countryOfficesItems(profiles)}
  />);
};

CountryOfficesList.propTypes = {
  profiles: PropTypes.array.isRequired,
};

export default CountryOfficesList;
