import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import MainContentWrapper from '../../components/common/mainContentWrapper';
import OrganizationItem from './organizationItem';
import CountryOfficesList from './countryOfficesList';

const messages = {
  header: 'Organization Profile',
};

const hgProfileMockData = {
  users: 25, update: '01 Jan 2016',
};

const styleSheet = createStyleSheet('OrganizationProfile', (theme) => {
  const padding = theme.spacing.unit * 2;
  return {
    container: {
      width: '100%',
      margin: '0',
      padding: `${padding}px 0 0 ${padding}px`,
      borderBottom: `2px ${theme.palette.grey[300]} solid`,
    },
    headlinePadding: {
      paddingBottom: `${padding}px`,
    },
  };
});

const OrganizationProfile = (props) => {
  const { classes } = props;
  return (
    <div>
      <Grid item>
        <Grid className={classes.container} container direction="column" gutter={16}>
          <Grid item>
            <Typography type="headline" className={classes.headlinePadding}>
              {messages.header}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <MainContentWrapper>
        <Grid container direction="column" gutter={40}>
          <Grid item>
            <Paper>
              <OrganizationItem users={hgProfileMockData.users} update={hgProfileMockData.update} />
            </Paper>
          </Grid>
          <Grid item>
            <CountryOfficesList />
          </Grid>
        </Grid>
      </MainContentWrapper>
    </div>
  );
};

OrganizationProfile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(OrganizationProfile);
