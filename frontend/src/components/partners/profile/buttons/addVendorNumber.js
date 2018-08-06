import React from 'react';
import PropTypes from 'prop-types';
import Add from 'material-ui-icons/Add';
import IconWithTextButton from '../../../common/iconWithTextButton';

const messages = {
  text: 'Add Vendor/Partner ID',
};

const AddVendorNumber = (props) => {
  const { handleClick } = props;
  return (
    <IconWithTextButton
      icon={<Add />}
      text={messages.text}
      onClick={handleClick}
    />
  );
};

AddVendorNumber.propTypes = {
  handleClick: PropTypes.func,
};

export default AddVendorNumber;
