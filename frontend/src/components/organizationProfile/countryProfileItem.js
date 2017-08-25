import React from 'react';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import Warning from 'material-ui-icons/Warning';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

const messages = {
  profile: 'HQ Profile',
  user: 'user',
  lastUpdate: 'Last update: ',
  pluralSuffix: 's',
};

const styleSheet = createStyleSheet('countryProfileItem', (theme) => {
  const paddingSmall = theme.spacing.unit / 2;
  const padding = theme.spacing.unit * 3;
  return {
    center: {
      textAlign: 'center',
    },
    right: {
      textAlign: 'right',
    },
    title: {
      fontSize: '15px',
    },
    icon: {
      fill: '#FF0000',
      width: 20,
      height: 20,
    },
    container: {
      width: '100%',
      margin: '0',
      padding: `${paddingSmall}px 0 ${paddingSmall}px ${padding}px`,
    },
  };
});

const pluralize = (count, noun, suffix = messages.pluralSuffix) => `${count} ${noun}${count !== 1 ? suffix : ''}`;

const CountryProfileItem = (props) => {
  const { classes, country, users, update, completed } = props;

  return (
    <Grid align="center" className={classes.container} container>
      <Grid item xs={5}>
        {country}
      </Grid>

      <Grid className={classes.center} item xs={2}>
        <Typography type="subheader" color="inherit">
          {pluralize(users, messages.user)}
        </Typography>
      </Grid>

      <Grid className={classes.right} item xs={3}>
        <Typography type="subheader" color="inherit">
          {messages.lastUpdate} {update}
        </Typography>
      </Grid>

      <Grid className={classes.right} item xs={1}>
        {completed ? <Warning className={classes.icon} /> : null}
      </Grid>

      <Grid className={classes.right} item xs={1}>
        <IconButton><KeyboardArrowRight /></IconButton>
      </Grid>
    </Grid>


  );
};

CountryProfileItem.propTypes = {
  classes: PropTypes.object.isRequired,
  country: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  update: PropTypes.object.isRequired,
  completed: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(CountryProfileItem);
