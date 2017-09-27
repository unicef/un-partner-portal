import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { CardHeader } from 'material-ui/Card';
import Paper from 'material-ui/Paper';


import Stepper from './stepper';

const styleSheet = theme => ({
  container: {
    height: '100%',
  },
  header: {
    color: theme.palette.primary[400],
    backgroundColor: theme.palette.secondary[500],
  },
});

const messages = {
  title: 'Registration',
};

const Registration = (props) => {
  const { classes } = props;
  return (
    <Grid container className={classes.container} justify="center" align="center">
      <Grid item xs={12} md={5} >
        <CardHeader
          className={classes.header}
          title={messages.title}
        />
        <Paper elevation={2} >
          <Stepper />
        </Paper>
      </Grid>
    </Grid>
  );
};

Registration.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'Registration' })(Registration);
