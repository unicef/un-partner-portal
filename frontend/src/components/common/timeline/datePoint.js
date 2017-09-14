import React, { Component } from 'react';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';
import SvgIcon from 'material-ui/SvgIcon';
import Typography from 'material-ui/Typography';
import className from 'classnames';

const styleSheet = createStyleSheet('DatePoint', (theme) => {
  const circleSize = 12;
  return {
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
  };
});

const DatePoint = (props) => {
  const { classes, label, date, type, colorClass, big, small, align, bold, color } = props;
  const mainClass = className(
    classes.root,
    classes[color],
    {
      [classes.bigItem]: big,
      [classes.smallItem]: small,
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
    <div className={mainClass}>
      <Typography type={fontType} align={align} className={classes.text}>{date}</Typography>
      <SvgIcon className={classes.firstIcon} viewBox={viewBox}>
        <circle cx="4" cy="4" r="4" />
      </SvgIcon>
      <Typography type={fontType} align={align} className={classes.text}>{label}</Typography>
    </div>
  );
};


export default withStyles(styleSheet)(DatePoint);
