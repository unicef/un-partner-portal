import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import SvgIcon from 'material-ui/SvgIcon';
import Typography from 'material-ui/Typography';
import className from 'classnames';
import { formatDateForPrint } from '../../../helpers/dates';

const styleSheet = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyItems: 'center',
    zIndex: 1,
  },
  text: {
    minHeight: 48,
  },
  bigItem: {
    flexBasis: '55%',
  },
  smallItem: {
    flexBasis: '15%',
  },
  left: {
    alignItems: 'flex-start',
  },
  right: {
    alignItems: 'flex-end',
  },
  center: {
    alignItems: 'center',
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
});

const DatePoint = (props) => {
  const {
    classes,
    label,
    date,
    flexSize,
    align,
    bold,
    color } = props;
  const mainClass = className(
    classes.root,
    classes[color],
    {
      [classes.left]: align === 'left',
      [classes.right]: align === 'right',
      [classes.center]: align === 'center',
    },
  );

  const fontType = bold ? 'body2' : 'body1';

  let viewBox = '-4 -4 16 16';
  if (align === 'left') viewBox = '0 -4 16 16';
  else if (align === 'right') viewBox = '-8 -4 16 16';
  return (
    <div
      className={mainClass}
      style={{
        'flex-basis': `${flexSize}%`,
      }}
    >
      <Typography
        type={fontType}
        align={align}
        className={classes.text}
      >
        {formatDateForPrint(date)}
      </Typography>
      <SvgIcon className={classes.firstIcon} viewBox={viewBox}>
        <circle cx="4" cy="4" r="4" />
      </SvgIcon>
      <Typography type={fontType} align={align} className={classes.text}>{label}</Typography>
    </div>
  );
};

DatePoint.propTypes = {
  classes: PropTypes.object,
  /**
   * label to be displayed below the point
   */
  label: PropTypes.string,
  /**
   * date to be displayed above the point
   */
  date: PropTypes.string,
  /**
   * size of the whole element flexbox (in %)
   */
  flexSize: PropTypes.number,
  /**
   * align of texts and dot, 
   */
  align: PropTypes.string,
  /**
   * if text should be bolded
   */
  bold: PropTypes.bool,
  /**
   * string for point color, supported are red, green, dark and blue
   */
  color: PropTypes.string,
};


export default withStyles(styleSheet, { name: 'DatePoint' })(DatePoint);
