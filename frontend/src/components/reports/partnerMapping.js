import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import { GoogleApiWrapper } from 'google-maps-react';
import HeaderList from '../common/list/headerList';
import SpreadContent from '../common/spreadContent';
import LocationsMap from '../forms/fields/projectFields/locationField/locationsMap';

const messages = {
  partnerMapping: 'Partner Mapping',
  defaultCountryCode: 'RUS',
  defaultCountryName: 'Russia',
};

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

    return (
      <HeaderList
        header={this.header}
      >
        <LocationsMap
          locations={locations}
          showMap
          readOnly
          currentCountryCode={messages.defaultCountryCode}
          currentCountry={messages.defaultCountryName}
          removeAllLocations={() => {}}
        />
      </HeaderList>);
  }
}

PartnerMapping.propTypes = {
  locations: PropTypes.array,
};

const wrappedPartnerMappin = GoogleApiWrapper({
  version: '3.exp',
  apiKey: process.env.GOOGLE_KEY,
})(PartnerMapping);

const mapStateToProps = (state, ownProps) => {
  const selectionIndexes = state.selectableList.items;

  let locations = [];

  if (selectionIndexes) {
    selectionIndexes.forEach((index) => {
      locations = locations.concat(ownProps.items[index][ownProps.fieldName]);
    });
  }

  return {
    locations,
  };
};

const connected = connect(mapStateToProps, null)(wrappedPartnerMappin);

export default (withStyles(styleSheet, { name: 'PartnerMapping' })(connected));
