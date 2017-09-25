import Typography from 'material-ui/Typography';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import Check from 'material-ui-icons/Check';

const DirectSelectionCell = (props) => {
  const { directSelection } = props;

  return (
    <TableCell disablePadding>
      {directSelection
        ? <Check />
        : <Typography type="body2">-</Typography>
      }
    </TableCell>
  );
};

DirectSelectionCell.propTypes = {
  directSelection: PropTypes.bool.isRequired,
};

export default DirectSelectionCell;
