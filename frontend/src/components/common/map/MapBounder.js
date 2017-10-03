import React from 'react';
import PropTypes from 'prop-types';

const MapBounder = (props) => {
  const { map, bounds, rebound, clearBounds } = props;
  if (bounds && map && rebound) {
    map.fitBounds(bounds);
    clearBounds();
  }
  return (<div />);
};

MapBounder.propTypes = {
  map: PropTypes.object,
  bounds: PropTypes.object,
  rebound: PropTypes.bool,
  clearBounds: PropTypes.func,
};

export default MapBounder;
