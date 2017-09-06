import Typography from 'material-ui/Typography';
import React from 'react';
import PropTypes from 'prop-types';
import ItemRowCell from './itemRowCell';

const DynamicItemCell = (props) => {
  const { items } = props;
  return (
    <div>
      {items.map(item => (
        <ItemRowCell label={item.name} content={item.area} />
      ))}
    </div>
  );
};

DynamicItemCell.propTypes = {
  items: PropTypes.array.isRequired,
};

export default DynamicItemCell;
