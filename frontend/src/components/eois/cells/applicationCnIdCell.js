import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import TableCell from './tableCell';

const ApplicationCnIdCell = (props) => {
  const { id } = props;
  return (
    <TableCell first limited>
      <Typography
        color="accent"
      >
        <u>{id}</u>
      </Typography>
    </TableCell>
  );
};

ApplicationCnIdCell.propTypes = {
  id: PropTypes.string,
};

export default ApplicationCnIdCell;
