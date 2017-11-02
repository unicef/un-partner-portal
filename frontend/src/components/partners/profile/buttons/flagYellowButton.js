import React from 'react';
import PropTypes from 'prop-types';
import IconWithTextButton from '../../../common/iconWithTextButton';
import FlagIcon from '../icons/flagIcon';
import { FLAGS } from '../../../../helpers/constants';

const messages = {
  text: 'Add yellow flag',
};

const FlagYellowButton = (props) => {
  const { handleClick } = props;
  return (
    <IconWithTextButton
      icon={<FlagIcon color={FLAGS.YELLOW} />}
      text={messages.text}
      onClick={handleClick}
    />
  );
};

FlagYellowButton.propTypes = {
  handleClick: PropTypes.func,
};

export default FlagYellowButton;
