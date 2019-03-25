import { Component } from 'react';
import PropTypes from 'prop-types';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
var MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder');

class LocationsGeocoder extends Component {
    componentDidMount() {
        const { map } = this.context;

        map.addControl(
            new MapboxGeocoder({
                accessToken: process.env.MAP_BOX_KEY
            })
        );
    }

    render() {
        return null;
    }

    static contextTypes = {
        map: PropTypes.object.isRequired
    };
}

export default LocationsGeocoder;