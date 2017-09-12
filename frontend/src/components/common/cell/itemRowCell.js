import Typography from 'material-ui/Typography';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';

const styleSheet = createStyleSheet('ItemRowCell', (theme) => {
  const padding = theme.spacing.unit;
  return {
    row: {
      display: 'flex',
    },
    padding: {
      padding: `0 0 0 ${padding}px`,
    },
  };
});

const ItemRowCell = (props) => {
  const { label, content, classes } = props;
  return (
    <div className={classes.row}>
      <Typography type="body1" color="secondary">
        {label}
      </Typography>
      <div className={classes.padding}>
        <Typography type="body1" color="inherit">
          {content}
        </Typography>
      </div>
    </div>
  );
};

ItemRowCell.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  content: PropTypes.string,
};

export default withStyles(styleSheet)(ItemRowCell);
