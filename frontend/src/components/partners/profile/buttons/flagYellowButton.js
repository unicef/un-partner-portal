import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Flag from 'material-ui-icons/Flag';
import IconWithTextButton from '../../../common/iconWithTextButton';

const styleSheet = createStyleSheet('FlagYellowButton', (theme) => {
  const paddingIcon = theme.spacing.unit;

  return {
    iconYellow: {
      fill: '#FFC400',
      width: 20,
      height: 20,
      margin: `0 ${paddingIcon}px 0 0`,
    },
  };
});

const messages = {
  text: 'Add yellow flag',
};

const flagYellow = (id) => {
  console.log(`Add yellow flag: ${id}`);
};

const FlagYellowButton = (props) => {
  const { classes, id } = props;
  return (
    <IconWithTextButton
      icon={<Flag className={classes.iconYellow} />}
      text={messages.text}
      onClick={() => flagYellow(id)}
    />
  );
};

FlagYellowButton.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.string,
};

export default withStyles(styleSheet)(FlagYellowButton);
