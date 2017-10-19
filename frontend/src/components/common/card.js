import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import { CardHeader } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import PaddedContent from './paddedContent';

const styleSheet = theme => ({
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  cardContainer: {
    minWidth: 300,
  },
  header: {
    color: theme.palette.primary[400],
    backgroundColor: theme.palette.secondary[500],
  },
});

const Card = (props) => {
  const { classes, children, title } = props;
  return (
    <div className={classes.center}>
      <div className={classes.cardContainer}>
        <CardHeader
          className={classes.header}
          title={title}
        />
        <Paper elevation={2} >
          <PaddedContent >
            {children}
          </PaddedContent>
        </Paper>
      </div>
    </div>
  );
};

Card.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  title: PropTypes.string,
};

export default withStyles(styleSheet, { name: 'Card' })(Card);
