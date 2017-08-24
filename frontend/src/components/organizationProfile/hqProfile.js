import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

const messages = {
  profile: 'HQ Profile',
  user: 'user',
  lastUpdate: 'Last update: ',
  pluralSuffix: 's',
};

const hgProfileMockData = {
  users: 25, update: '01 Jan 2016',
};

const styleSheet = createStyleSheet('sidebarMenu', (theme) => {
  const padding = theme.spacing.unit;
  const paddingMedium = theme.spacing.unit * 2;
  return {
    center: {
      textAlign: 'center',
    },
    title: {
      fontSize: '20px',
    },
    container: {
      width: '100%',
      margin: '0',
      padding: `${paddingMedium}px 0 ${paddingMedium}px ${padding}px`,
    },
  };
});

const pluralize = (count, noun, suffix = messages.pluralSuffix) => `${count} ${noun}${count !== 1 ? suffix : ''}`;

class HqProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper>
        <Grid align="center" className={classes.container} container>
          <Grid item xs={6}>
            <div className={classes.title}>{messages.profile}</div>
          </Grid>

          <Grid className={classes.center} item xs={2}>
            {pluralize(hgProfileMockData.users, messages.user)}
          </Grid>

          <Grid className={classes.center} item xs={3}>
            {messages.lastUpdate} {hgProfileMockData.update}
          </Grid>

          <Grid item xs={1}>
            <IconButton><KeyboardArrowRight /></IconButton>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

HqProfile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(HqProfile);
