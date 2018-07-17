import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { FormSection, formValueSelector, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import { GoogleApiWrapper } from 'google-maps-react';
import HeaderList from '../common/list/headerList';
import SpreadContent from '../common/spreadContent';
import LocationsMap from '../forms/fields/projectFields/locationField/locationsMap';

const messages = {
  partnerMapping: 'Partner Mapping',
};

const testLocations = [
  {
    admin_level_1: { name: 'admin level 1 name 0', country_code: 'SO', country_name: 'Somalia' },
    country_code: 'SO',
    country_name: 'Somalia',
    id: 2223,
    name: 'admin level 1 name 0',
    lat: '60.00000',
    lon: '131.00000',
  },
];
const styleSheet = theme => ({
  root: {
    height: '400px',
  },
  filterContainer: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
    background: theme.palette.primary[300],
  },
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  info: {
    color: 'gray',
    fontWeight: '350',
    padding: '4px 0',
  },
});

  /* eslint-disable react/prefer-stateless-function */
class PartnerMapping extends Component {
  /* eslint-disable class-methods-use-this */
  header() {
    return (<SpreadContent>
      <Typography type="headline" >{messages.partnerMapping}</Typography>
    </SpreadContent>);
  }

  render() {
    const { locations } = this.props;
console.log('This', locations);
    return (
      <HeaderList
        header={this.header}
      >
        <LocationsMap
          locations={locations}
          showMap
          readOnly
          currentCountryCode={'PL'}
          currentCountry={'Poland'}
          removeAllLocations={() => {}}
        />
      </HeaderList>);
  }
}

PartnerMapping.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func,
  locations: PropTypes.array,
};

const wrappedPartnerMappin = GoogleApiWrapper({
  version: '3.exp',
  apiKey: process.env.GOOGLE_KEY,
})(PartnerMapping);

const mapStateToProps = (state) => {
  const selectionIndexes = state.selectableList.items;
  const items = state.reportsPartnerList.items;

  let locations = [];

  if (selectionIndexes) {
    selectionIndexes.forEach((index) => {
      locations = locations.concat(items[index].offices);
    });
  }

  return {
    locations,
  };
};

const connected = connect(mapStateToProps, null)(wrappedPartnerMappin);

export default (withStyles(styleSheet, { name: 'PartnerMapping' })(connected));
