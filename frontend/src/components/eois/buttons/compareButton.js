import React from 'react';
import PropTypes from 'prop-types';
import Compare from 'material-ui-icons/CompareArrows';
import IconWithTooltipButton from '../../common/iconWithTooltipButton';

const messages = {
  text: 'Compare',
};

const compare = (id) => {
  console.log(`Compare: ${id}`);
};

const CompareButton = (props) => {
  const { id, ...other } = props;
  return (
    <IconWithTooltipButton
      id={id}
      icon={<Compare />}
      name="compare"
      text={messages.text}
      onClick={() => compare(id)}
      {...other}
    />
  );
};

CompareButton.propTypes = {
  id: PropTypes.string,
};

export default CompareButton;
