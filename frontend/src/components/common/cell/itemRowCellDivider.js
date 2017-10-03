import Typography from 'material-ui/Typography';
import React from 'react';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styleSheet = (theme) => {
  const padding = theme.spacing.unit;
  return {
    row: {
      display: 'flex',
      marginBottom: 'auto',
    },
    alignRight: {
      marginLeft: 'auto',
    },
    padding: {
      padding: `0 0 0 ${padding}px`,
    },
    paddingTopBottom: {
      padding: `${padding}px 0 ${padding}px 0`,
    },
    paddingTop: {
      padding: `${padding}px 0 0 0`,
    },
  };
};

const ItemRowCellDivider = (props) => {
  const { label, content, divider, labelSecondary, classes } = props;
  return (
    <div>
      <Grid container align="center" justify="space-between" direction="row">
        <Grid className={classes.row} item xs={8}>
          <Typography color={labelSecondary ? 'secondary' : 'inherit'} type="body1" >{label}</Typography>
        </Grid>
        <Grid item xs={4} >
          <Typography type="body1" >{content}</Typography>
        </Grid>
      </Grid>
      {!divider
        ? <div className={classes.paddingTopBottom}>
          <Divider />
        </div>
        : <div className={classes.paddingTop} />}
    </div>
  );
};

ItemRowCellDivider.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  labelSecondary: PropTypes.bool,
  content: PropTypes.string,
  divider: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'ItemRowCellDivider' })(ItemRowCellDivider);
