import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CardHeader } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
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
      [theme.breakpoints.up('md')]: {
        width: '30vw',
      },
      [theme.breakpoints.down('md')]: {
        width: '100vw',
      },
    },
    header: {
      color: 'white',
      height: '100px',
      textAlign: 'center',
      backgroundColor: theme.palette.secondary[500],
    },
    subtitle: {
      padding: `${padding}px`,
      color: 'black',
      background: '#F6F6F6',
    },
  };
};

const CardLogin = (props) => {
  const { classes, children, title } = props;
  return (
    <div className={classes.center}>
      <div className={classes.cardContainer}>
        <Paper elevation={2} >
          <CardHeader
            className={classes.header}
            title={title}
          />
          <PaddedContent >
            {children}
          </PaddedContent>
        </Paper>
      </div>
    </div>
  );
};

CardLogin.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  title: PropTypes.string,
};

export default withStyles(styleSheet, { name: 'CardLogin' })(CardLogin);
