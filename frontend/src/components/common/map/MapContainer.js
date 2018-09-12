
import React from 'react';
import PropTypes from 'prop-types';
import ReactMapboxGl from "react-mapbox-gl";

const MapGl = ReactMapboxGl({
  accessToken: process.env.MAP_BOX_KEY,
});

const style = {
  position: 'relative',
  height: '40vh',
};

const MapContainer = (props) => {
  const { children, center, bounds, locations, onClick, ...other } = props;

  return (
    <MapGl
      style="mapbox://styles/mapbox/streets-v9"
      center={center}
      fitBounds={bounds}
      onClick={onClick}
      containerStyle={style}>
      {children}
    </MapGl>
  );
};

MapContainer.propTypes = {
  children: PropTypes.array,
};

export default MapContainer;
