import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import withCountryName from '../common/hoc/withCountryName';

const PartnerProfileCountryCell = (props) => {
  const { countryName } = props;
  return (
    <TableCell>
      {countryName}
    </TableCell>
  );
};

PartnerProfileCountryCell.propTypes = {
  countryName: PropTypes.string.isRequired,
};

export default withCountryName(PartnerProfileCountryCell);
