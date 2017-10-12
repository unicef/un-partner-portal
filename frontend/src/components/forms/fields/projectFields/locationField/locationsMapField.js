
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { arrayPush, arrayRemove, formValueSelector, arrayRemoveAll } from 'redux-form';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import SpreadContent from '../../../../common/spreadContent';
import LocationsMap from './locationsMap';


const messages = {
  label: 'Choose Admin 1 location(s) for this country - pick location(s) from the map ' +
  '(optional). Remove locations by double-clicking the markers.',
  showMap: 'show map',
  hideMap: 'hide map',
};

class LocationsMapField extends Component {
  constructor() {
    super();
    this.state = {
      showMap: true,
    };
    this.switchMap = this.switchMap.bind(this);
    this.saveLocation = this.saveLocation.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
    this.removeAllLocations = this.removeAllLocations.bind(this);
  }

  switchMap() {
    this.setState({ showMap: !this.state.showMap });
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
    dispatch(arrayPush(formName, `${name}.locations`, newLocation));
  }

  removeLocation(index) {
    const { dispatch, name, formName } = this.props;
    dispatch(arrayRemove(formName, `${name}.locations`, index));
  }

  removeAllLocations() {
    const { dispatch, name, formName } = this.props;
    dispatch(arrayRemoveAll(formName, `${name}.locations`));
  }

  render() {
    const { countryCode, currentCountry, currentLocations } = this.props;
    const {
      showMap,
    } = this.state;
    return (
      <div>
        <SpreadContent>
          <Typography type="caption">{messages.label}</Typography>
          <Button
            color="accent"
            disabled={!countryCode}
            onClick={this.switchMap}
          >
            {showMap ? messages.hideMap : messages.showMap}
          </Button>
        </SpreadContent>
        <LocationsMap
          currentCountryCode={countryCode}
          currentCountry={currentCountry}
          locations={currentLocations}
          showMap={showMap}
          saveLocation={this.saveLocation}
          removeLocation={this.removeLocation}
          removeAllLocations={this.removeAllLocations}
        />
      </div>
    );
  }
}

LocationsMapField.propTypes = {
  countryCode: PropTypes.string,
  currentCountry: PropTypes.string,
  currentLocations: PropTypes.array,
  name: PropTypes.string,
  formName: PropTypes.string,
  dispatch: PropTypes.func,
};

export default connect(
  (state, ownProps) => {
    const selector = formValueSelector(ownProps.formName);
    const { country, locations } = selector(state, `${ownProps.name}`);
    const currentCountry = country ? state.countries[country] : null;
    const currentLocations = locations || [];
    return {
      countryCode: country,
      currentCountry,
      currentLocations,
    };
  },
)(LocationsMapField);
