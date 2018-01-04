import R from 'ramda';
import React, { Component } from 'react';
import { FormHelperText } from 'material-ui/Form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { arrayPush, arrayRemove, formValueSelector, arrayRemoveAll } from 'redux-form';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import SpreadContent from '../../../../common/spreadContent';
import LocationsMap from './locationsMap';


const messages = {
  label: 'Choose location(s) for this country - pick location(s) from the map. Remove locations by clicking the markers.',
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

  saveLocation(newLocation) {
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
        {currentCountry && R.isEmpty(currentLocations) && <FormHelperText error>{'Select locations'}</FormHelperText>}
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
