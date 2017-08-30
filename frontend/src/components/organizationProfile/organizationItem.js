import IconButton from 'material-ui/IconButton';
import Warning from 'material-ui-icons/Warning';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import React, { Component } from 'react';
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

const styleSheet = createStyleSheet('HqProfile', (theme) => {
  const paddingSmall = theme.spacing.unit / 2;
  const padding = theme.spacing.unit;
  const paddingMedium = theme.spacing.unit * 2;

  return {
    center: {
      textAlign: 'center',
    },
    right: {
      textAlign: 'right',
    },
    icon: {
      fill: '#FF0000',
      width: 20,
      height: 20,
    },
    hqProfile: {
      width: '100%',
      margin: '0',
      padding: `${paddingMedium}px 0 ${paddingMedium}px ${padding}px`,
    },
    countryItem: {
      width: '100%',
      margin: '0',
      padding: `${paddingSmall}px 0 ${paddingSmall}px ${padding}px`,
    },
  };
});

const pluralize = (count, noun, suffix = messages.pluralSuffix) => `${count} ${noun}${count !== 1 ? suffix : ''}`;

class OrganizationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  render() {
    const { classes, isCountryItem, title, users, update, completed } = this.props;
    return (
      <Grid align="center" container className={isCountryItem ? classes.countryItem : classes.hqProfile}>
        <Grid item xs={5}>
          <Typography type={isCountryItem ? 'body1' : 'title'} color="inherit">
            {title}
          </Typography>
        </Grid>

        <Grid className={classes.center} item xs={2}>
          <Typography type="body1" color="inherit">
            {pluralize(users, messages.user)}
          </Typography>
        </Grid>

        <Grid className={classes.right} item xs={3}>
          <Typography type="body1" color="inherit">
            {messages.update} {update}
          </Typography>
        </Grid>

        <Grid className={classes.right} item xs={1}>
          {isCountryItem && completed ? <Warning className={classes.icon} /> : null}
        </Grid>

        <Grid className={classes.right} item xs={1}>
          <IconButton>
            <KeyboardArrowRight />
          </IconButton>
        </Grid>
      </Grid>
    );
  }
}

OrganizationItem.propTypes = {
  classes: PropTypes.object.isRequired,
  isCountryItem: PropTypes.bool.isRequired,
  completed: PropTypes.bool,
  title: PropTypes.string.isRequired,
  users: PropTypes.number.isRequired,
  update: PropTypes.string.isRequired,
};

OrganizationItem.defaultProps = {
  isCountryItem: false,
  completed: true,
  title: messages.profile,
  users: 0,
  update: '',
};

export default withStyles(styleSheet)(OrganizationItem);
