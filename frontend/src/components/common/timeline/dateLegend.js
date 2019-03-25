import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import SvgIcon from 'material-ui/SvgIcon';
import Typography from 'material-ui/Typography';
import className from 'classnames'; 

const styleSheet = theme => ({
  root: {
    display: 'flex',
    justifyItems: 'center',
    marginLeft: '10px',
  },
  text: {
    minHeight: 48,
  },
  fullWidth: {
    flex: 1,
  },
  green: {
    color: theme.palette.dateColors.green,
  },
  red: {
    color: theme.palette.dateColors.red,
  },
  blue: {
    color: theme.palette.dateColors.blue,
  },
  dark: {
    color: theme.palette.dateColors.dark,
  },
  orange: {
    color: theme.palette.dateColors.orange,
  },
  legend: {
    fontSize: 12,
  }
});

const DateLegend = (props) => {
  const {
    classes,
    label,
    color } = props;
  const mainClass = className(
    classes.root,
    classes[color]
  );

  return (
    <div className={mainClass}>
      <SvgIcon>
        <circle cx="12" cy="8" r="5" />
      </SvgIcon>
      <Typography className={classes.legend} >{label}</Typography>
    </div>
  );
};

DateLegend.propTypes = {
  classes: PropTypes.object,
  /**
   * label to be displayed below the point
   */
  label: PropTypes.string,
  /**
   * string for point color, supported are red, green, dark and blue
   */
  color: PropTypes.string,
};


export default withStyles(styleSheet, { name: 'DateLegend' })(DateLegend);
