
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Marker, InfoWindow } from 'google-maps-react';
import Typography from 'material-ui/Typography';
import SearchBox from '../../../../common/map/SearchBox';
import MapContainer from '../../../../common/map/MapContainer';
import MapBounder from '../../../../common/map/MapBounder';
import { errorToBeAdded } from '../../../../../reducers/errorReducer';

const mapError = 'Mapping feature is not supported in this location';

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
class LocationsMapBase extends Component {
  constructor() {
    super();
    this.state = {
      pos: null,
      previousCountry: null,
      activeMarker: null,
      showingInfoWindow: false,
      hoverMarker: null,
      activeMarkerNumber: null,
      activeLocation: null,
      rebound: true,
    };
    this.geocoder = new google.maps.Geocoder();
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
      showingInfoWindow: false,
    });
  }

  onMarkerOver(props, marker) {
    if (!this.state.activeMarker || !this.state.showingInfoWindow || (this.state.activeMarker
      && this.state.activeMarker.position.lat() !== marker.position.lat()
      && this.state.activeMarker.position.lng() !== marker.position.lng())) {
      this.setState({
        activeLocation: props.location,
        activeMarker: marker,
        showingInfoWindow: true,
      });
    }
  }

  initMap(country) {
    const { removeAllLocations } = this.props;

    if (this.state.previousCountry && this.state.previousCountry !== country) {
      removeAllLocations();
    }

    this.setState({ previousCountry: country });
    this.geocoder.geocode({ address: country }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        this.setState({
          pos: {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          },
          bounds: results[0].geometry.viewport,
          rebound: true,
        });
      }
    });
  }

  clearBounds() {
    this.setState({ rebound: false });
  }

  mapClicked(mapProps, map, clickEvent) {
    const { readOnly, postError } = this.props;

    if (!readOnly) {
      const { currentCountryCode, saveLocation } = this.props;
      this.geocoder.geocode({ location: clickEvent.latLng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results) {
          let countryCode;
          let loc = results.find(location =>
            location.types.includes('administrative_area_level_1'));
          if (loc === undefined) {
            loc = results.find(location =>
              location.types.includes('country'));
            countryCode = loc.address_components[0].short_name;
          } else {
            countryCode = loc.address_components[1].short_name;
          }
          if (countryCode !== currentCountryCode) return;
          const newLocation = {
            admin_level_1: {
              name: loc.address_components[0].long_name,
              country_code: countryCode },
            lat: clickEvent.latLng.lat().toFixed(5),
            lon: clickEvent.latLng.lng().toFixed(5),
          };
          saveLocation(newLocation);
        } else if (status !== google.maps.GeocoderStatus.OK) {
          postError(status);
        }
      });
    }
  }

  removeMarker(markerProps) {
    const { removeLocation, readOnly } = this.props;
    const { index } = markerProps;
    this.setState({
      showingInfoWindow: false,
    });

    if (!readOnly) {
      removeLocation(index);
    }
  }

  renderMarkers() {
    const { locations } = this.props;

    return locations.map(({ lat, lon, admin_level_1 }, index) => (
      <Marker
        key={`${lat}_${lon}_${index}`}
        label=""
        index={index}
        location={admin_level_1.name}
        onClick={this.removeMarker}
        onMouseover={this.onMarkerOver}
        onMouseout={this.onMarkerOut}
        position={{ lat, lng: lon }}
      />
    ));
  }

  render() {
    const { showMap } = this.props;
    const {
      pos,
      bounds,
      rebound,
      activeMarker,
      showingInfoWindow,
      activeLocation,
    } = this.state;

    return (pos && showMap && <MapContainer
      initialCenter={pos}
      center={pos}
      streetViewControl={false}
      mapTypeControl={false}
      bounds
      onClick={this.mapClicked}
    >
      <MapBounder bounds={bounds} rebound={rebound} clearBounds={this.clearBounds} />
      {this.renderMarkers()}
      {activeLocation && <InfoWindow
        marker={activeMarker}
        visible={showingInfoWindow}
        text={activeLocation}
      >
        <Typography>{activeLocation}</Typography>
      </InfoWindow>}
      <SearchBox />
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
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  postError: error => dispatch(errorToBeAdded(
    error, `pinNotAdded${ownProps.activeMarkercurrentCountryCode}`, mapError)),
});


export default connect(null, mapDispatchToProps)(LocationsMapBase);
