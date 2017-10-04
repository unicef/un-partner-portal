import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Tooltip from '../common/tooltip';

const styleSheet = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  infoIcon: {
    fill: theme.palette.text.secondary,
    '&:hover': {
      fill: theme.palette.text.primary,
    },
  },
});

const TooltipIcon = (props) => {
  const { classes, Icon, iconClass, infoText, displayTooltip, ...other } = props;
  return (
    <Grid item className={classes.root} >
      <div data-tip>
        <Icon
          className={iconClass || classes.infoIcon}
          {...other}
        />
        { displayTooltip && <Tooltip text={infoText} /> }
      </div>
    </Grid>
  );
};


TooltipIcon.propTypes = {
  classes: PropTypes.object,
  /**
   * Icon to be displayed
   */
  Icon: PropTypes.func,
  /**
   * text passed to tooltip
   */
  infoText: PropTypes.string,
  /**
   * class for the icon
   */
  iconClass: PropTypes.string,
  /**
   * whether tooltip should be displayed at all
   */
  displayTooltip: PropTypes.bool,
};

TooltipIcon.defaultProps = {
  displayTooltip: true,
};

export default withStyles(styleSheet, { name: 'TooltipIcon' })(TooltipIcon);
