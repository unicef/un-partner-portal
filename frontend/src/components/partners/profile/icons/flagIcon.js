import React from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';

import { withStyles } from 'material-ui/styles';
import Flag from 'material-ui-icons/Flag';
import { FLAGS } from '../../../../helpers/constants';


const styleSheet = (theme) => {
  const paddingIcon = theme.spacing.unit;
  return {
    icon: {
      width: 20,
      height: 20,
      margin: `0 ${paddingIcon}px 0 0`,
    },
    iconYellow: {
      fill: theme.palette.flags.yellow,
    },
    iconRed: {
      fill: theme.palette.flags.red,
    },
  };
};

const FlagIcon = (props) => {
  const { classes, color } = props;
  const className = classname(
    classes.icon,
    {
      [classes.iconRed]: color === FLAGS.RED,
      [classes.iconYellow]: color === FLAGS.YELLOW,
    });
  return <Flag className={className} />;
};

FlagIcon.propTypes = {
  color: PropTypes.string,
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'FlagIcon' })(FlagIcon);
