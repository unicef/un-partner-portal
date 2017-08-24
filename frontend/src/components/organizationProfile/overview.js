import React from 'react';
import Grid from 'material-ui/Grid';
import HqProfile from './hqProfile';
import CountryOfficesList from './countryOfficesList';

const OverviewProfile = () => (
  <Grid container direction="column" gutter={40}>
    <Grid item>
      <HqProfile />
    </Grid>
    <Grid item>
      <CountryOfficesList />
    </Grid>
  </Grid>
);

export default OverviewProfile;
