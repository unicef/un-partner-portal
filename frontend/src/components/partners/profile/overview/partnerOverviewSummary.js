import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../common/list/headerList';
import PaddedContent from '../../../common/paddedContent';
import ItemRowCell from '../../../common/cell/itemRowCell';
import ItemRowCellDivider from '../../../common/cell/itemRowCellDivider';


const styleSheet = createStyleSheet('HqProfileOverviewHeader', theme => ({
  root: {
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
  },
}));

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
    <ItemRowCellDivider label={labels.partnerName} content={partner.name} />
    <ItemRowCellDivider label={labels.partnerId} content={partner.partnerId} />
    <ItemRowCellDivider label={labels.type} content={partner.organisationType} />
    <ItemRowCellDivider label={labels.country} content={partner.operationCountry} />
    <ItemRowCellDivider label={labels.location} content={partner.location} />
    <ItemRowCellDivider divider label={labels.headOfOrganization} />
    <ItemRowCellDivider divider labelSecondary label={labels.firstName} content={partner.head.firstName} />
    <ItemRowCellDivider divider labelSecondary label={labels.lastName} content={partner.head.lastName} />
    <ItemRowCellDivider divider labelSecondary label={labels.jobTitle} content={partner.head.title} />
    <ItemRowCellDivider divider labelSecondary label={labels.telephone} content={partner.head.telephone} />
    <ItemRowCellDivider divider labelSecondary label={labels.mobile} content={partner.head.mobile} />
    <ItemRowCellDivider divider labelSecondary label={labels.fax} content={partner.head.fax} />
    <ItemRowCellDivider labelSecondary label={labels.email} content={partner.head.email} />
    <ItemRowCellDivider label={labels.contact} content={partner.contact} />
    <ItemRowCellDivider label={labels.sectors} content={partner.name} />
    <ItemRowCellDivider label={labels.populations} content={partner.population} />
    <ItemRowCellDivider label={labels.experience} content={partner.experience} />
    <ItemRowCellDivider label={labels.unExperience} content={partner.unExperience} />
    <ItemRowCellDivider label={labels.budget} content={partner.budget} />
    <ItemRowCellDivider label={labels.results} content={partner.keyResults} />
    <ItemRowCellDivider divider label={labels.mandate} content={partner.mandateMission} />
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
  const { classes, partner } = props;
  return (
    <HeaderList
      headerObject={summaryHeader(classes, partner.lastUpdate)}
      rows={[fields(partner)]}
    />);
};

PartnerOverviewSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  partner: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(PartnerOverviewSummary);
