
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

const messages = {
  selected: 'selected',
};

const styleSheet = theme => ({
  root: {
    paddingRight: 2,
    backgroundColor: theme.palette.primary[100],
    width: '100%',
  },
  highlight: {
    color: 'white',
    backgroundColor: theme.palette.accent[500],
  },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

const EnhancedTableToolbar = (props) => {
  const { numSelected, classes, title, children } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0
          ? <Typography type="subheading" color="inherit">
            {`${numSelected} ${messages.selected}`}
          </Typography>
          : <Typography type="title" color="inherit">{title}</Typography>}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 &&
          children
        }
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default withStyles(styleSheet, { name: 'EnhancedTableToolbar' })(EnhancedTableToolbar);
