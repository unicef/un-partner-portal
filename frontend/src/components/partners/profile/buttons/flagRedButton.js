import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Flag from 'material-ui-icons/Flag';
import IconWithTextButton from '../../../common/iconWithTextButton';

const styleSheet = createStyleSheet('FlagRedButton', (theme) => {
  const paddingIcon = theme.spacing.unit;

  return {
    iconRed: {
      fill: '#D50000',
      width: 20,
      height: 20,
      margin: `0 ${paddingIcon}px 0 0`,
    },
  };
});

const messages = {
  text: 'Add red flag',
};

const flagRed = (id) => {
  console.log(`Add red flag: ${id}`);
};

const FlagRedButton = (props) => {
  const { classes, id } = props;
  return (
    <IconWithTextButton
      icon={<Flag className={classes.iconRed} />}
      text={messages.text}
      onClick={() => flagRed(id)}
    />
  );
};

FlagRedButton.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.string,
};

export default withStyles(styleSheet)(FlagRedButton);
