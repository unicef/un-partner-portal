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

  saveLocation(newLocation) {
    const { dispatch, name, formName } = this.props;

    dispatch(arrayPush(formName, `${name}`, newLocation));
  }

  removeLocation(index) {
    const { dispatch, name, formName } = this.props;
    dispatch(arrayRemove(formName, `${name}`, index));
  }

  render() {
    const { countryCode, currentCountry, readOnly, currentLocations } = this.props;

    return (
      <GridColumn>
        <GridColumn>
          <Typography type="caption">{messages.label}</Typography>
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
    const currentLocations = locations ? R.filter(item => !R.isEmpty(item), locations) : [];
    const partner = R.find(item => item.id === Number(ownProps.params.id), state.session.partners || state.agencyPartnersList.partners);
    const currentCountry = partner ? state.countries[partner.country_code] : null;
    const countryCode = partner ? partner.country_code : {};

    return {
      countryCode,
      currentCountry,
      currentLocations,
    };
  },
)(LocationsMapField);

export default withRouter(connected);
