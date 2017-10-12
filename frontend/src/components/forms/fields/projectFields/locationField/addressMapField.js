import R from 'ramda';
import { withRouter } from 'react-router';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { arrayPush, arrayRemove, formValueSelector, arrayRemoveAll } from 'redux-form';
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

    this.saveLocation = this.saveLocation.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
  }

  saveLocation(newLocation) {
    const { dispatch, name, formName } = this.props;
    dispatch(arrayPush(formName, `${name}`, newLocation));
  }

  removeLocation(index) {
    const { dispatch, name, formName } = this.props;
    dispatch(arrayRemove(formName, `${name}`, index));
  }

  render() {
    const { countryCode, currentCountry, currentLocations } = this.props;

    return (
      <div>
        <SpreadContent>
          <Typography type="caption">{messages.label}</Typography>
        </SpreadContent>
        <LocationsMap
          currentCountryCode={countryCode}
          currentCountry={currentCountry}
          locations={currentLocations}
          showMap
          saveLocation={this.saveLocation}
          removeLocation={this.removeLocation}
          removeAllLocations={() => {}}
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
