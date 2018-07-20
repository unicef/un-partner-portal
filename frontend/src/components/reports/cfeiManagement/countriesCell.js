import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import withCountryName from '../../common/hoc/withCountryName';
import EoiCountryCell from '../../eois/cells/eoiCountryCell';

const CountriesCell = (props) => {
  const { locations } = props;

  return (
    <TableCell>
      {locations && locations.map(item =>
        (<div key={item.id}><EoiCountryCell code={item.admin_level_1.country_code} />{R.last(locations) !== item ? ', ' : null }</div>))}
    </TableCell>
  );
};

CountriesCell.propTypes = {
  locations: PropTypes.array.isRequired,
};

export default withCountryName(CountriesCell);
