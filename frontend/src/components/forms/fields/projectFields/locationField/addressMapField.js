import R from 'ramda';
import { withRouter } from 'react-router';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { arrayPush, arrayRemove, formValueSelector } from 'redux-form';
import Typography from 'material-ui/Typography';
import GridColumn from '../../../../common/grid/gridColumn';
import LocationsMap from './locationsMap';


const messages = {
  label: 'Location of field office(s) in the country of operation - pick location(s) from the map.',
};

class LocationsMapField extends Component {
  constructor() {
    super();

    this.saveLocation = this.saveLocation.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
    this.selectedLocations = this.selectedLocations.bind(this);
  }

  saveLocation(clickEvent, code, results) {
    let countryCode;
    let loc = results.find(location =>
      location.types.includes('administrative_area_level_1'));
    if (loc === undefined) {
      loc = results.pop();
      countryCode = loc.address_components[0].short_name;
    } else {
      countryCode = loc.address_components[1].short_name;
    }
    if (countryCode !== code) return;
    const newLocation = {
      country_code: countryCode,
      admin_level_1: { name: loc.address_components[0].long_name },
      lat: clickEvent.latLng.lat().toFixed(5),
      lon: clickEvent.latLng.lng().toFixed(5),
      formatted_address: loc.formatted_address,
    };

    const { dispatch, name, formName } = this.props;
    dispatch(arrayPush(formName, `${name}`, newLocation));
  }

  removeLocation(index) {
    const { dispatch, name, formName } = this.props;
    dispatch(arrayRemove(formName, `${name}`, index));
  }

  selectedLocations() {
    const { currentLocations } = this.props;

    const removeDuplicates = R.uniqWith((a, b) => a.admin_level_1.name === b.admin_level_1.name)(currentLocations);

    return removeDuplicates.map(location =>
      <Typography>{location.admin_level_1.name} </Typography>,
    );
  }

  render() {
    const { countryCode, currentCountry, readOnly, currentLocations } = this.props;

    return (
      <GridColumn>
        <GridColumn>
          <Typography type="caption">{messages.label}</Typography>
          {this.selectedLocations(currentLocations)}
        </GridColumn>
        <LocationsMap
          currentCountryCode={countryCode}
          currentCountry={currentCountry}
          locations={currentLocations}
          showMap
          readOnly={readOnly}
          saveLocation={this.saveLocation}
          removeLocation={this.removeLocation}
          removeAllLocations={() => {}}
        />
      </GridColumn>
    );
  }
}

LocationsMapField.propTypes = {
  countryCode: PropTypes.string,
  currentCountry: PropTypes.string,
  currentLocations: PropTypes.array,
  name: PropTypes.string,
  readOnly: PropTypes.bool,
  formName: PropTypes.string,
  dispatch: PropTypes.func,
};


const connected = connect(
  (state, ownProps) => {
    const selector = formValueSelector(ownProps.formName);
    const locations = selector(state, ownProps.name);
    const currentLocations = locations || [];
    const countryProfile = R.find(country => country.id === Number(ownProps.params.id), state.countryProfiles.hq.country_profiles);
    const currentCountry = countryProfile ? state.countries[countryProfile.country_code] : {};
    const countryCode = countryProfile ? countryProfile.country_code : {};

    return {
      countryCode,
      currentCountry,
      currentLocations,
    };
  },
)(LocationsMapField);

export default withRouter(connected);
