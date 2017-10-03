
import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'google-maps-react';


const style = {
  position: 'relative',
  height: '450px',
};

const MapContainer = (props) => {
  const { children, ...other } = props;
  return (
    <Map
      containerStyle={style}
      google={window.google}
      {...other}
      styles={[
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ visibility: 'off' }],
        },
      ]
      }
    >
      {children}
    </Map>
  );
};

MapContainer.propTypes = {
  children: PropTypes.array,
};

export default MapContainer;
