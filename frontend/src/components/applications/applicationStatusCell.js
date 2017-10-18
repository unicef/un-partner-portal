import Typography from 'material-ui/Typography';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import withApplicationStatus from '../common/hoc/withApplicationStatus';

const ApplicationStatusCell = (props) => {
  const { status } = props;

  return (
    <TableCell>
      <Typography type="body1">{status}</Typography>
    </TableCell>
  );
};

ApplicationStatusCell.propTypes = {
  status: PropTypes.object.isRequired,
};

export default withApplicationStatus(ApplicationStatusCell);

