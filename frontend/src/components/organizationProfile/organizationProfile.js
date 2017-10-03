import React from 'react';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import MainContentWrapper from '../../components/common/mainContentWrapper';
import HeaderNavigation from '../../components/common/headerNavigation';
import OrganizationItem from './organizationItem';
import CountryOfficesList from './countryOfficesList';

const messages = {
  header: 'Organization Profile',
};

const hgProfileMockData = {
  users: 25, update: '01 Jan 2016',
};

const OrganizationProfile = () => (
  <div>
    <Grid item>
      <HeaderNavigation title={messages.header} />
    </Grid>
    <MainContentWrapper>
      <Grid container direction="column" spacing={40}>
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

export default OrganizationProfile;
