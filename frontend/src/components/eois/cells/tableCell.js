import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import {
  TableCell,
} from 'material-ui/Table';

const styleSheet = theme => ({
  limitedCell: {
    maxWidth: 250,
  },
  firstCell: {
    padding: `0px 4px 0px ${theme.spacing.unit * 4}px`,
  },
});

const CustomTableCell = (props) => {
  const { classes, children, first, limited, ...other } = props;
  const className = classNames(
    {
      [classes.firstCell]: first,
      [classes.limitedCell]: limited,
    },
  );
  return (
    <TableCell className={className} {...other} >
      {children}
    </TableCell >
  );
};

CustomTableCell.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
  first: PropTypes.bool,
  limited: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'CustomTableCell' })(CustomTableCell);
