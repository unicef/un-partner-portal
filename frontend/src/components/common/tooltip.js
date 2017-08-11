import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';


const styleSheet = createStyleSheet('OrganizationTypes', (theme) => {
  const bgColor = theme.palette.grey[700];
  return {
    root: {
      color: theme.palette.getContrastText(bgColor),
      background: bgColor,
      position: 'absolute',
      zIndex: 1,
      left: 0,
      width: '100%',
      padding: 8,
    },
    text: {
      whiteSpace: 'pre-line',
      padding: 4,
      fontSize: 12,
    },
  };
});

function Tooltip(props) {
  const { classes, text } = props;
  return (
    <Paper
      className={classes.root}
      elevation={0}
    >
      <Typography type="body2" color="inherit" className={classes.text} align="left">
        {text}
      </Typography>

    </Paper>

  );
}

Tooltip.propTypes = {
  /**
  * text body of the tooltip
  */
  text: PropTypes.string,

};

export default withStyles(styleSheet)(Tooltip);
