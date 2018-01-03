import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import withCountryName from '../common/hoc/withCountryName';
import EoiCountryCell from '../eois/cells/eoiCountryCell';

const CountriesCell = (props) => {
  const { countries } = props;

  return (
    <TableCell>
      {countries && countries.map(item =>
        (<div key={item}><EoiCountryCell code={item} />{R.last(countries) !== item ? ', ' : null }</div>))}
    </TableCell>
  );
};

CountriesCell.propTypes = {
  countries: PropTypes.array.isRequired,
};

export default withCountryName(CountriesCell);
