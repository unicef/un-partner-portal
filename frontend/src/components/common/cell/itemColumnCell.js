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
  const { label, content, object, classes } = props;
  return (
    <div>
      <Typography type="caption" className={classes.label}>
        {label}
      </Typography>
      {content && !object ?
        <Typography type="body1" color="inherit">
          {content || '-'}
        </Typography>
        : object}
    </div>
  );
};

ItemColumnCell.propTypes = {
  classes: PropTypes.object,
  label: PropTypes.string.isRequired,
  content: PropTypes.string,
  object: PropTypes.node,
};

export default withStyles(styleSheet, { name: 'ItemColumnCell' })(ItemColumnCell);
