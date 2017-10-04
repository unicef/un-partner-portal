import React from 'react';
import Grid from 'material-ui/Grid';
import R from 'ramda';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../common/list/headerList';
import PaddedContent from '../../../common/paddedContent';
import ItemRowCell from '../../../common/cell/itemRowCell';
import ItemRowCellDivider from '../../../common/cell/itemRowCellDivider';


const styleSheet = () => ({
  root: {
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
  },
});

const labels = {
  profileSummary: 'Organization Profile Summary',
  updated: 'Last updated: ',
  partnerName: 'Partner name',
  partnerId: 'Partner ID',
  type: 'Type of organisation',
  country: 'Country',
  location: 'Location',
  headOfOrganization: 'Head of organization',
  firstName: 'First Name',
  lastName: 'Last Name',
  jobTitle: 'Job Title/Position',
  telephone: 'Telephone',
  mobile: 'Mobile',
  fax: 'Fax',
  email: 'Email',
  contact: 'Contact Info',
  sectors: 'Sector and areas of specialisation',
  populations: 'Populations of concern',
  experience: 'Years of experience',
  unExperience: 'UN Experience',
  budget: 'Annual Budget',
  results: 'Key results',
  mandate: 'Mandate and Mission',
};

const fields = partner => (
  <PaddedContent>
    <ItemRowCellDivider label={labels.partnerName} content={R.prop('name', partner)} />
    <ItemRowCellDivider label={labels.partnerId} content={R.prop('partnerId', partner)} />
    <ItemRowCellDivider label={labels.type} content={R.prop('organisationType', partner)} />
    <ItemRowCellDivider label={labels.country} content={R.prop('operationCountry', partner)} />
    <ItemRowCellDivider label={labels.location} content={R.prop('location', partner)} />
    <ItemRowCellDivider divider label={labels.headOfOrganization} />
    <ItemRowCellDivider divider labelSecondary label={labels.firstName} content={R.path(['head', 'firstName'], partner)} />
    <ItemRowCellDivider divider labelSecondary label={labels.lastName} content={R.path(['head', 'lastName'], partner)} />
    <ItemRowCellDivider divider labelSecondary label={labels.jobTitle} content={R.path(['head', 'title'], partner)} />
    <ItemRowCellDivider divider labelSecondary label={labels.telephone} content={R.path(['head', 'telephone'], partner)} />
    <ItemRowCellDivider divider labelSecondary label={labels.mobile} content={R.path(['head', 'mobile'], partner)} />
    <ItemRowCellDivider divider labelSecondary label={labels.fax} content={R.path(['head', 'fax'], partner)} />
    <ItemRowCellDivider labelSecondary label={labels.email} content={R.path(['head', 'email'], partner)} />
    <ItemRowCellDivider label={labels.contact} content={R.prop('contact', partner)} />
    <ItemRowCellDivider label={labels.sectors} content={R.prop('name', partner)} />
    <ItemRowCellDivider label={labels.populations} content={R.prop('population', partner)} />
    <ItemRowCellDivider label={labels.unExperience} content={R.prop('unExperience', partner)} />
    <ItemRowCellDivider label={labels.budget} content={R.prop('budget', partner)} />
    <ItemRowCellDivider label={labels.results} content={R.prop('keyResults', partner)} />
    <ItemRowCellDivider divider label={labels.mandate} content={R.prop('mandateMission', partner)} />
  </PaddedContent>
);

const summaryHeader = (classes, lastUpdate) => (
  <Grid container align="center" justify="space-between" direction="row">
    <Grid item xs={8}>
      <Typography className={classes.root} type="title" >{labels.profileSummary}</Typography>
    </Grid>
    <Grid item xs={4} >
      <ItemRowCell alignRight label={labels.updated} content={lastUpdate} />
    </Grid>
  </Grid>
);

const PartnerOverviewSummary = (props) => {
  const { classes, partner, loading } = props;
  console.log(partner);
  return (
    <HeaderList
      header={summaryHeader(classes, R.prop('lastUpdate', partner))}
      rows={[fields(partner)]}
      loading={loading}
    />);
};

PartnerOverviewSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  partner: PropTypes.object.isRequired,
  loading: PropTypes.bool,
};

PartnerOverviewSummary.defaultProps = {
  partner: {},
};

export default withStyles(styleSheet, { name: 'PartnerOverviewSummary' })(PartnerOverviewSummary);
