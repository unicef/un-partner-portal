import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Tooltip from '../common/tooltip';

const styleSheet = createStyleSheet('OrganizationTypes', theme => ({
  infoIcon: {
    fill: theme.palette.text.secondary,
    '&:hover': {
      fill: theme.palette.text.primary,
    },
  },
}));

class TooltipIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipShown: false,
    };
    this.hideTooltip = this.hideTooltip.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  hideTooltip() {
    this.setState({ tooltipShown: false });
  }

  showTooltip() {
    this.setState({ tooltipShown: true });
  }

  handleMouseEnter() {
    this.showTooltip();
  }

  handleMouseLeave() {
    this.hideTooltip();
  }

  render() {
    const { classes, Icon, iconClass, infoText, displayTooltip, ...other } = this.props;
    const { tooltipShown } = this.state;
    return (
      <Grid item >
        <Icon
          className={iconClass || classes.infoIcon}
          onMouseLeave={this.handleMouseLeave}
          onMouseEnter={this.handleMouseEnter}
          {...other}
        />
        { displayTooltip && tooltipShown && <Tooltip text={infoText} /> }
      </Grid>

    );
  }
}

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

export default withStyles(styleSheet)(TooltipIcon);
