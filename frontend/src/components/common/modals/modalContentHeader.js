import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';


const styleSheet = theme => ({
  root: {
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit,
  },
});

function ModalContentHeader(props) {
  const { classes, titleText, bodyText = '' } = props;
  return (
    <Grid item>
      <Paper className={classes.root} elevation={0}>
        <Typography type="body2">
          {titleText}
        </Typography>
        <Typography type="subheading">
          {bodyText}
        </Typography>
      </Paper>
    </Grid>
  );
}

ModalContentHeader.propTypes = {
  /**
   * title text of the header
   */
  titleText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  /**
   * body text of the header
   */
  bodyText: PropTypes.string,
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'ModalContentHeader' })(ModalContentHeader);
