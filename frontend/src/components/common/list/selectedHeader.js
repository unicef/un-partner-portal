
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import SpreadContent from '../spreadContent'

const messages = {
  selected: 'items selected',
};

const styleSheet = createStyleSheet(theme => ({
  root: {
    color: 'white',
    backgroundColor: theme.palette.accent[500],
  },
}));

const SelectedHeader = (props) => {
  const { numSelected, classes, children } = props;

  return (
    <Toolbar
      className={classNames(classes.root)}
    >
      <SpreadContent >
        <Typography type="subheading" color="inherit">
          {`${numSelected} ${messages.selected}`}
        </Typography>
        {children}
      </SpreadContent>
    </Toolbar>
  );
};

SelectedHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default withStyles(styleSheet)(SelectedHeader);
