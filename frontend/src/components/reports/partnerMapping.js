import React, { Component } from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Typography from 'material-ui/Typography';
import HeaderList from '../common/list/headerList';
import SpreadContent from '../common/spreadContent';
import LocationsMap from '../forms/fields/projectFields/locationField/locationsMap';

const messages = {
  defaultCountryCode: 'US',
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
  constructor(props) {
    super(props);

    this.header = this.header.bind(this);
  }
  /* eslint-disable class-methods-use-this */
  header() {
    return (<SpreadContent>
      <Typography type="headline">{this.props.title}</Typography>
    </SpreadContent>);
  }

  render() {
    const { locations, country_code } = this.props;

    return (
      <HeaderList
        header={this.header}
      >
        <LocationsMap
          locations={locations}
          showMap
          readOnly
          currentCountryCode={country_code || messages.defaultCountryCode}
          currentCountry={country_code || messages.defaultCountryCode}
          removeAllLocations={() => {}}
        />
      </HeaderList>);
  }
}

PartnerMapping.propTypes = {
  locations: PropTypes.array,
  title: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  const selectionIds = state.selectableList.items;
  const { query: { country_code } = {} } = ownProps.location;

  let locations = [];

  if (selectionIds && ownProps.items) {
    selectionIds.forEach((id) => {
      const item = R.filter(filterItem => filterItem.id === id, ownProps.items);

      if (item.length > 0) {
        locations = locations.concat(item[0][ownProps.fieldName]);
      }
    });
  }

  return {
    locations,
    country_code,
  };
};

const connected = connect(mapStateToProps, null)(PartnerMapping);
const withRouterMapping = withRouter(connected);

export default (withStyles(styleSheet, { name: 'PartnerMapping' })(withRouterMapping));
