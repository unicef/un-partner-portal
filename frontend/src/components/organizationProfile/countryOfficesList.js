import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HeaderList from '../../components/common/list/headerList';
import OrganizationItem from './organizationItem';
import CountryOfficesHeaderContainer from './countryOfficesHeaderContainer';

const countryOfficesItems = profiles => profiles.map(item =>
  (<OrganizationItem
    isCountryItem
    title={item.name}
    users={item.users}
    update={item.update}
    completed={item.completed}
  />));

const CountryOfficesList = props => (
  <HeaderList
    header={CountryOfficesHeaderContainer}
    rows={countryOfficesItems(props.countryProfiles)}
  />
);

CountryOfficesList.propTypes = {
  countryProfiles: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  countryProfiles: state.countryProfiles.countryProfiles,
});

export default connect(mapStateToProps)(CountryOfficesList);
