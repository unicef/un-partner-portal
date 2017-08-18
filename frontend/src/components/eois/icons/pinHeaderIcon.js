import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import IconButton from 'material-ui/IconButton';
import PinIcon from '../../common/pinIcon';

const styleSheet = createStyleSheet('RegularTable', () => ({
  headerIcon: {
    color: 'white',
  },
}));

const PinHeaderIcon = (props) => {
  const { classes } = props;
  return (
    <IconButton className={classes.headerIcon} aria-label="Pin all">
      <PinIcon />
    </IconButton>
  );
};

PinHeaderIcon.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PinHeaderIcon);
