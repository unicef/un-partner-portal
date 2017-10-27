
import React from 'react';
import PropTypes from 'prop-types';
import Ok from 'material-ui-icons/Done';

const isDirectCell = (props) => {
  const { isDirect } = props;
  return (isDirect ? <Ok /> : <div>-</div>);
};

isDirectCell.propTypes = {
  isDirect: PropTypes.bool,
};

export default isDirectCell;
