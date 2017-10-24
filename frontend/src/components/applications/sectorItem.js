import Typography from 'material-ui/Typography';
import React from 'react';
import PropTypes from 'prop-types';
import withSectorType from '../common/hoc/withSectorType';

const ApplicationStatusCell = (props) => {
  const { sector } = props;

  return (
    <Typography type="body1">{sector}</Typography>
  );
};

ApplicationStatusCell.propTypes = {
  sector: PropTypes.object.isRequired,
};

export default withSectorType(ApplicationStatusCell);
