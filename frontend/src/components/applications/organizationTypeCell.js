import Typography from 'material-ui/Typography';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import withOrganizationType from '../common/hoc/withOrganizationType';

const OrganizationTypeCell = (props) => {
  const { type } = props;

  return (
    <TableCell>
      <Typography type="body1">{type}</Typography>
    </TableCell>
  );
};

OrganizationTypeCell.propTypes = {
  type: PropTypes.string.isRequired,
};

export default withOrganizationType(OrganizationTypeCell);

