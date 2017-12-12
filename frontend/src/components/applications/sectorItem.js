import Typography from 'material-ui/Typography';
import React from 'react';
import PropTypes from 'prop-types';
import withSectorType from '../common/hoc/withSectorType';

const SectorItem = (props) => {
  const { sector } = props;

  return (
    <Typography type="body1">{sector}</Typography>
  );
};

SectorItem.propTypes = {
  sector: PropTypes.object.isRequired,
};

export default withSectorType(SectorItem);
