import React from 'react';
import PropTypes from 'prop-types';
import IconWithTextButton from '../../../common/iconWithTextButton';
import FlagIcon from '../icons/flagIcon';
import { FLAGS } from '../../../../helpers/constants';

const messages = {
  text: 'Add red flag',
};


const FlagRedButton = (props) => {
  const { handleClick } = props;
  return (
    <IconWithTextButton
      icon={<FlagIcon color={FLAGS.RED} />}
      text={messages.text}
      onClick={handleClick}
    />
  );
};

FlagRedButton.propTypes = {
  handleClick: PropTypes.func,
};

export default FlagRedButton;
