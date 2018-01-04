import React from 'react';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import OrganizationProfileOverview from './organizationProfileOverview';
import SwitchProfileOverview from '../buttons/switchProfileOverview';

const styleSheet = () => ({
  print: {
    '@media print': {
      boxShadow: 'none',
    },
  },
});

const OrganizationProfileOverviewPaper = ({ classes }) => (
  <React.Fragment>
    <SwitchProfileOverview />
    <Paper className={classes.print}>
      <OrganizationProfileOverview />

    </Paper>
  </React.Fragment>
);

export default withStyles(styleSheet)(OrganizationProfileOverviewPaper);
