import Typography from 'material-ui/Typography';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';

const WrappedCell = (props) => {
  const { content } = props;

  return (
    <TableCell>
      <Typography type="body1">{content}</Typography>
    </TableCell>
  );
};

WrappedCell.propTypes = {
  content: PropTypes.string.isRequired,
};

export default WrappedCell;
