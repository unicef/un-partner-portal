import React from 'react';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import OrganizationProfileOverview from './organizationProfileOverview';


const styleSheet = () => ({
  print: {
    '@media print': {
      boxShadow: 'none',
    },
  },
});

const OrganizationProfileOverviewPaper = ({ classes }) => (
  <Paper className={classes.print}>
    <OrganizationProfileOverview />
  </Paper>
);

export default withStyles(styleSheet)(OrganizationProfileOverviewPaper);
