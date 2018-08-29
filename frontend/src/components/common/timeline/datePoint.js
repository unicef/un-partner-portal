import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import SvgIcon from 'material-ui/SvgIcon';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import className from 'classnames';
import { formatDateForPrint } from '../../../helpers/dates';

const styleSheet = theme => ({
  lightTooltip: {
    background: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[2],
    fontSize: 12,
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '15px',
    padding: '5px 2px',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  containerLeft: {
    justifyContent: 'flex-start',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyItems: 'center',
    zIndex: 1,
  },
  text: {
    minHeight: 48,
  },
  fullWidth: {
    flex: 1,
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
  bold: {
    fontWeight: 500,
  },
  greenB: {
    borderBottom: `4px solid ${theme.palette.dateColors.green}`,
  },
  redB: {
    borderBottom: `4px solid ${theme.palette.dateColors.red}`,
  },
  blueB: {
    borderBottom: `4px solid ${theme.palette.dateColors.blue}`,
  },
  darkB: {
    borderBottom: `4px solid ${theme.palette.dateColors.dark}`,
  },
  orangeB: {
    borderBottom: `4px solid ${theme.palette.dateColors.orange}`,
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
});

const DatePoint = (props) => {
  const {
    classes,
    label,
    date,
    position,
    flexSize,
    align,
    bold,
    fullWidth,
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
  const containerClass = className(
    classes.container,
    {
      [classes.containerLeft]: align === 'left',
      [classes.fullWidth]: fullWidth,
    });

  const tooltipClass = className(
    classes.lightTooltip,
    classes[`${color}B`]);

  const labelClass = className({ [classes.bold]: bold });

  let viewBox = '-4 -4 16 16';
  if (align === 'left') viewBox = '0 -5 16 16';
  else if (align === 'right') viewBox = '-5 -4 16 16';

  return (
    <div
      className={containerClass}
      style={{
        flexBasis: `${flexSize < 10 ? 10 : flexSize}%`,
      }}
    >
      <div className={mainClass}>
        {/* <Typography
          type={fontType}
          align={align}
          className={classes.text}
        >
          {formatDateForPrint(date) || ''}
        </Typography> */}
        <Tooltip
          PopperProps={{
            eventsEnabled: false,
          }}
          classes={{ tooltip: tooltipClass }}
          id={`${label}-button`}
          title={<div className={classes.title}>
            <div className={labelClass}>{label}</div>
            <div className={labelClass}>{formatDateForPrint(date) || ''}</div>
          </div>}
          placement={position}
          open
        >
          <SvgIcon className={classes.firstIcon} viewBox={viewBox}>
            <circle cx="5" cy="5" r="5" />
          </SvgIcon>

        </Tooltip>
        {/* <Typography type={fontType} align={align} className={classes.text}>{label}</Typography> */}
      </div>
    </div>
  );
};

DatePoint.propTypes = {
  classes: PropTypes.object,
  position: PropTypes.string,
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
  /**
   * whether date element should take all remaining space
   */
  fullWidth: PropTypes.bool,
};


export default withStyles(styleSheet, { name: 'DatePoint' })(DatePoint);
