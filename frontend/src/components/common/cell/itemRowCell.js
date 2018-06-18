import Typography from 'material-ui/Typography';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styleSheet = (theme) => {
  const padding = theme.spacing.unit;
  return {
    row: {
      display: 'flex',
    },
    alignRight: {
      marginLeft: 'auto',
    },
    padding: {
      padding: `0 0 0 ${padding}px`,
    },
  };
};

const ItemRowCell = (props) => {
  const { label, content, alignRight, classes } = props;
  return (
    <div className={classes.row}>
      <Typography className={alignRight && classes.alignRight} type="body1" color="accent">
        {label}
      </Typography>
      <div className={classes.padding}>
        {!!content && <Typography type="body1" color="inherit">
          {content}
        </Typography>}
      </div>
    </div>
  );
};

ItemRowCell.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  alignRight: PropTypes.bool,
  content: PropTypes.string,
};

export default withStyles(styleSheet, { name: 'ItemRowCell' })(ItemRowCell);
