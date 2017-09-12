import Typography from 'material-ui/Typography';
import React from 'react';
import PropTypes from 'prop-types';

const ItemColumnCell = (props) => {
  const { label, content } = props;
  return (
    <div>
      <Typography type="caption" color="secondary">
        {label}
      </Typography>
      <Typography type="body1" color="inherit">
        {content}
      </Typography>
    </div>
  );
};

ItemColumnCell.propTypes = {
  label: PropTypes.string.isRequired,
  content: PropTypes.string,
};

export default ItemColumnCell;
