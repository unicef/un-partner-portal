import Typography from 'material-ui/Typography';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styleSheet = theme => ({
  label: {
    color: theme.palette.common.formLabel,
    paddingBottom: '5px',
  },
});

const ItemColumnCell = (props) => {
  const { label, content, classes } = props;
  return (
    <div>
      <Typography type="caption" className={classes.label}>
        {label}
      </Typography>
      <Typography type="body1" color="inherit">
        {content || '-'}
      </Typography>
    </div>
  );
};

ItemColumnCell.propTypes = {
  classes: PropTypes.object,
  label: PropTypes.string.isRequired,
  content: PropTypes.string,
};

export default withStyles(styleSheet, { name: 'ItemColumnCell' })(ItemColumnCell);
