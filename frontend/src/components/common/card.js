import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import { CardHeader } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import PaddedContent from './paddedContent';

const styleSheet = (theme) => {
  const padding = theme.spacing.unit * 2;
  return {
    center: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
    cardContainer: {
      minWidth: 300,
      [theme.breakpoints.up('md')]: {
        width: '50vw',
      },
      [theme.breakpoints.down('md')]: {
        width: '100vw',
      },
    },
    header: {
      color: 'white',
      backgroundColor: theme.palette.secondary[500],
    },
    subtitle: {
      padding: `${padding}px`,
      color: 'black',
      background: '#F6F6F6',
    },
  };
};

const Card = (props) => {
  const { classes, children, title, subtitle_1, subtitle_2 } = props;
  return (
    <div className={classes.center}>
      <div className={classes.cardContainer}>
        <CardHeader
          className={classes.header}
          title={title}
        />
        {(subtitle_1 || subtitle_2) && <div className={classes.subtitle}>
          <Typography type="body2"> {subtitle_1}</Typography>
          <Typography type="caption"> {subtitle_2}</Typography>
        </div>}
        <Paper elevation={2} >
          <PaddedContent >
            {children}
          </PaddedContent>
        </Paper>
      </div>
    </div>
  );
};

Card.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle_1: PropTypes.string,
  subtitle_2: PropTypes.string,
};

export default withStyles(styleSheet, { name: 'Card' })(Card);
