import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import PolarRadio from '../forms/fields/PolarRadio';


const styleSheet = createStyleSheet('DeclarationRow', theme => ({
  container: {
    borderBottom: `1px ${theme.palette.grey[300]} solid`,
  },
  column: {
    borderRight: `1px ${theme.palette.grey[300]} solid`,
  },
  message: {
    whiteSpace: 'pre-line',
    padding: 4,
  },
}));

function DeclarationRow(props) {
  const { classes, message, index } = props;
  return (
    <Grid item className={classes.container}>
      <Grid container direction="row" align="center">
        <Grid item xs={8} className={classes.column}>
          <Typography className={classes.message}>{message}</Typography>
        </Grid>
        <Grid item xs={4}>
          <PolarRadio
            fieldName={`questions[${index}]`}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}


DeclarationRow.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
  /**
   * Message to be displayed
   */
  message: PropTypes.string,
  /**
   * Index of the row.
   */
  index: PropTypes.number,
};

export default withStyles(styleSheet)(DeclarationRow);
