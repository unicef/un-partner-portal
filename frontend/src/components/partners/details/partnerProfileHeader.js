
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import React from 'react';
import MoreVert from 'material-ui-icons/MoreVert';

const PartnerProfileHeader = (props) => {
  const { handleMoreClick } = props;

  return (
    <IconButton onClick={handleMoreClick} >
      <MoreVert />
    </IconButton>

  );
};

PartnerProfileHeader.propTypes = {
  handleMoreClick: PropTypes.func.isRequired,
};

export default PartnerProfileHeader;
