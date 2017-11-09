
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SearchBox extends Component {
  componentWillUpdate(nextProps) {
    if (this.props.map === undefined && nextProps !== undefined) {
      const searchBox = new google.maps.places.SearchBox(this.searchBoxInput);
      nextProps.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.searchBoxInput);

      // Bias the SearchBox results towards current map's viewport.
      nextProps.map.addListener('bounds_changed', () => {
        searchBox.setBounds(nextProps.map.getBounds());
      });
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) {
          return;
        }
        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
          if (!place.geometry) return;

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        nextProps.map.fitBounds(bounds);
      });
    }
  }
  render() {
    return (<input
      className="controls"
      type="text"
      placeholder="Search Box"
      ref={(node) => { this.searchBoxInput = node; }}
    />);
  }
}

SearchBox.propTypes = {
  map: PropTypes.object,
};

export default SearchBox;
