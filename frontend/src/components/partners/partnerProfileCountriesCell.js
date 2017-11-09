import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import withCountryName from '../common/hoc/withCountryName';
import EoiCountryCell from '../eois/cells/eoiCountryCell';

const PartnerProfileCountriesCell = (props) => {
  const { countries } = props;

  return (
    <TableCell>
      {countries && countries.map(item => (<div><EoiCountryCell code={item} />{', '}</div>))}
    </TableCell>
  );
};

PartnerProfileCountriesCell.propTypes = {
  countries: PropTypes.array.isRequired,
};

export default withCountryName(PartnerProfileCountriesCell);
