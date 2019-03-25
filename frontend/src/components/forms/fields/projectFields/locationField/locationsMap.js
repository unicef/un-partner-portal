
import React, { Component } from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Place from 'material-ui-icons/Place';
import { Marker, Popup, ZoomControl } from "react-mapbox-gl";
import MapContainer from '../../../../common/map/MapContainer';
import { errorToBeAdded } from '../../../../../reducers/errorReducer';
import LocationsGeocoder from './locationsGeocoder';
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_BOX_KEY });
/**
 * this component is controlled implementation of map.
 * To work, it needs to recieve focused country name, than it will center and zoom to this
 * specific country through geolocation.
 * It supports clicking on the map to make save specific location, but only in selected country.
 * The map is in controlled mode, that means it doesn't store locations, so it needs callbacks to
 * manipulate location storage: saveLocation, removeLocation, removeAllLocations
 * Markers, geolocation calls, search function, infoboxes are all controlled by this component
 * itself.
 * Model used to save location:
 * {
 *   country_code
 *   admin_level_1: { name },
 *   lat
 *   lon
 *   formatted_address
 * }
 */

const messages = {
  error: 'Please indicate locations within the geographic boundaries of the selected country',
};

class LocationsMapBase extends Component {
  constructor() {
    super();
    this.state = {
      pos: null,
      previousCountry: null,
      activeMarker: null,
      hoverMarker: null,
      activeMarkerNumber: null,
      activeLocation: null,
    };

    this.initMap = this.initMap.bind(this);
    this.mapClicked = this.mapClicked.bind(this);
    this.onMarkerOver = this.onMarkerOver.bind(this);
    this.onMarkerOut = this.onMarkerOut.bind(this);
    this.clearBounds = this.clearBounds.bind(this);
    this.removeMarker = this.removeMarker.bind(this);
  }

  componentDidMount() {
    const { currentCountry } = this.props;

    if (currentCountry) {
      this.initMap(currentCountry);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentCountry } = this.props;
    const nextCountry = nextProps.currentCountry;

    if (currentCountry !== nextCountry) {
      this.initMap(nextCountry);
    }
  }

  onMarkerOut() {
    this.setState({
      activeLocation: null,
      activeMarker: null,
    });
  }

  onMarkerOver(lat, lon, admin) {
    if (!this.state.activeLocation) {
      this.setState({
        activeLocation: { lat, lon, name: admin.name },
      });
    }
  }

  initMap(country) {
    const { countries, removeAllLocations } = this.props;

    if (this.state.previousCountry && this.state.previousCountry !== country && !this.props.readOnly) {
      removeAllLocations();
    }

    let code;

    if (!countries[country]) {
      code = R.keys(countries)[R.indexOf(country, R.values(countries))]
    }

    geocodingClient.forwardGeocode({ query: countries[country] || country, limit: 1, countries: [code || country] })
      .send()
      .then(response => {
        if (response.body.features.length > 0) {
          const match = response.body.features[0];

          this.setState({
            pos: match.center,
            bounds: match.bbox,
          });
        }
      });

    this.setState({ previousCountry: country });
  }

  clearBounds() {
    this.setState({ rebound: false });
  }

  mapClicked(arg, clickEvent) {
    const { readOnly, postError, currentCountryCode, saveLocation } = this.props;

    if (!readOnly) {
      geocodingClient.reverseGeocode({ query: [clickEvent.lngLat.lng, clickEvent.lngLat.lat], language: ['en'] })
        .send()
        .then(response => {
          if (response.statusCode === 200) {
            let region = R.filter(feature => feature.place_type[0] === 'region', response.body.features)[0];
            let country = R.filter(feature => feature.place_type[0] === 'country', response.body.features)[0];

            if (region && country && country.properties && currentCountryCode === country.properties.short_code.toUpperCase()) {
              const newLocation = {
                admin_level_1: {
                  name: region.text_en,
                  country_code: currentCountryCode
                },
                lat: clickEvent.lngLat.lat.toFixed(5),
                lon: clickEvent.lngLat.lng.toFixed(5),
              };
              saveLocation(newLocation);
            } else {
              postError(messages.error);
            }
          } else {
            postError(messages.error);
          }
        });
    }
  }

  removeMarker(index) {
    const { removeLocation, readOnly } = this.props;
    this.setState({
      activeLocation: null,
    });

    if (!readOnly) {
      removeLocation(index);
    }
  }

  render() {
    const { showMap, locations, readOnly } = this.props;
    const {
      pos,
      bounds,
      activeLocation,
    } = this.state;

    return (pos && showMap && <MapContainer
      center={pos}
      bounds={bounds}
      onClick={this.mapClicked}
    >
      {!readOnly && <LocationsGeocoder />}
      <ZoomControl position="bottom-right" />
      {locations && locations.map(({ lat, lon, admin_level_1 }, index) => (
        <Marker onClick={(event) => this.removeMarker(index)}
          onMouseEnter={() => this.onMarkerOver(lat, lon, admin_level_1)}
          onMouseLeave={this.onMarkerOut} coordinates={[lon, lat]} key={index} anchor="bottom">
          <Place color="accent" />
        </Marker>
      ))}

      {activeLocation
        && <Popup
          coordinates={[activeLocation.lon, activeLocation.lat]}
          offset={{ 'bottom-left': [12, -38], 'bottom': [0, -38], 'bottom-right': [-12, -38] }}>
          {activeLocation.name}
        </Popup>}
    </MapContainer>
    );
  }
}

LocationsMapBase.propTypes = {
  /**
   * country code of currently focused country, used to disable clicking on other countries
   */
  currentCountryCode: PropTypes.string,
  /**
   * focused country full name used for geolocation to reduce disambiguation
   */
  currentCountry: PropTypes.string,
  /**
   * selected locations array, as map is controlled-only
   */
  locations: PropTypes.array,
  /**
   * callback to save single location in external storage, fired when map is clicked
   */
  saveLocation: PropTypes.func,
  /**
   * calllback to remove location from external storage, fired when marker is removed by double-tap
   */
  removeLocation: PropTypes.func,
  /**
   * callback to remove all locations from external storage, fired when main country switches
   */
  removeAllLocations: PropTypes.func,
  /**
   * bool to show map (also focused country name is required to show map)
   */
  showMap: PropTypes.bool,
  /**
   * bool to disable map clicks to read only mode
   */
  readOnly: PropTypes.bool,
  /**
   * function to save error in redux and display snackbar
   */
  postError: PropTypes.func,

  countries: PropTypes.object.isRequired,
};


const mapStateToProps = state => ({
  countries: state.countries,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  postError: error => dispatch(errorToBeAdded(
    error, `pinNotAdded${ownProps.activeMarkercurrentCountryCode}`, messages.error)),
});


export default connect(mapStateToProps, mapDispatchToProps)(LocationsMapBase);
