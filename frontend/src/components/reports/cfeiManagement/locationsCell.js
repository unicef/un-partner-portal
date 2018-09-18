import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';

const LocationsCell = (props) => {
  const { locations } = props;

  return (
    <TableCell>
      {locations && locations.map(item =>
        (<div key={item.id}>{item.admin_level_1.name}{R.last(locations) !== item ? ', ' : null }</div>))}
    </TableCell>
  );
};

LocationsCell.propTypes = {
  locations: PropTypes.array.isRequired,
};

export default LocationsCell;
