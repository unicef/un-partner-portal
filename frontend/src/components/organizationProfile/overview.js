import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';

import HqProfile from './hqProfile';
import CountryOfficesList from './countryOfficesList';

const Overview = () => (

  <Grid container direction="column" gutter={40}>
    <Grid item>
      <HqProfile />
    </Grid>
    <Grid item>
      <CountryOfficesList />
    </Grid>
  </Grid>

);

Overview.PropTypes = {
  classes: PropTypes.object.isRequired,
};

export default Overview;