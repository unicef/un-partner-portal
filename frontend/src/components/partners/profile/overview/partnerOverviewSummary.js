import React from 'react';
import R from 'ramda';
import { browserHistory as history } from 'react-router';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import HeaderList from '../../../common/list/headerList';
import PaddedContent from '../../../common/paddedContent';
import ItemRowCell from '../../../common/cell/itemRowCell';
import ItemRowCellDivider from '../../../common/cell/itemRowCellDivider';
import SpreadContent from '../../../common/spreadContent';
import { formatDateForPrint } from '../../../../helpers/dates';

const labels = {
  profileSummary: 'Profile summary',
  updated: 'Last updated: ',
  partnerName: 'Partner name',
  partnerId: 'Partner ID',
  type: 'Type of organisation',
  country: 'Country',
  location: 'Location',
  headOfOrganization: 'Head of organization',
  fullname: 'Full Name',
  jobTitle: 'Job Title/Position',
  telephone: 'Telephone',
  mobile: 'Mobile',
  fax: 'Fax',
  email: 'Email',
  contact: 'Contact Info',
  sectors: 'Sector and areas of specialisation',
  year: 'Year of registration',
  populations: 'Populations of concern',
  experience: 'Years of establishment in country of origin',
  unExperience: 'UN Experience',
  budget: 'Annual Budget',
  results: 'Key results',
  mandate: 'Mandate and Mission',
  viewProfile: 'view profile',
};

const fields = (partner, button) => (
  <PaddedContent>
    <ItemRowCellDivider label={labels.partnerName} content={R.prop('name', partner)} />
    <ItemRowCellDivider label={labels.partnerId} content={`${R.prop('partnerId', partner)}`} />
    <ItemRowCellDivider label={labels.type} content={R.prop('organisationType', partner)} />
    <ItemRowCellDivider label={labels.country} content={R.prop('operationCountry', partner)} />
    <ItemRowCellDivider label={labels.location} content={R.prop('location', partner)} />
    <ItemRowCellDivider divider label={labels.headOfOrganization} />
    <ItemRowCellDivider divider labelSecondary label={labels.fullname} content={R.path(['head', 'fullname'], partner)} />
    <ItemRowCellDivider divider labelSecondary label={labels.jobTitle} content={R.path(['head', 'title'], partner)} />
    <ItemRowCellDivider divider labelSecondary label={labels.telephone} content={R.path(['head', 'telephone'], partner)} />
    <ItemRowCellDivider divider labelSecondary label={labels.mobile} content={R.path(['head', 'mobile'], partner)} />
    <ItemRowCellDivider divider labelSecondary label={labels.fax} content={R.path(['head', 'fax'], partner)} />
    <ItemRowCellDivider labelSecondary label={labels.email} content={R.path(['head', 'email'], partner)} />
    <ItemRowCellDivider label={labels.contact} content={R.prop('contact', partner)} />
    <ItemRowCellDivider label={labels.sectors} content={R.prop('sectors', partner)} />
    <ItemRowCellDivider label={labels.year} content={formatDateForPrint(R.prop('yearOfEstablishment', partner))} />
    <ItemRowCellDivider label={labels.populations} content={R.prop('population', partner)} />
    <ItemRowCellDivider label={labels.unExperience} content={R.prop('unExperience', partner)} />
    <ItemRowCellDivider label={labels.budget} content={R.prop('budget', partner)} />
    <ItemRowCellDivider label={labels.results} content={R.prop('keyResults', partner)} />
    <ItemRowCellDivider divider label={labels.mandate} content={R.prop('mandateMission', partner)} />
    {button && <Grid container justify="flex-end">
      <Grid item>
        <Button
          onClick={() => history.push(`/partner/${R.prop('partnerId', partner)}/details`)}
          color="accent"
        >
          {labels.viewProfile}
        </Button>
      </Grid>
    </Grid>}
  </PaddedContent>
);

const summaryHeader = lastUpdate => (
  <SpreadContent>
    <Typography type="headline" >{labels.profileSummary}</Typography>
    <ItemRowCell alignRight label={labels.updated} content={lastUpdate} />
  </SpreadContent>
);

const PartnerOverviewSummary = (props) => {
  const { partner, loading, button } = props;
  return (
    <HeaderList
      header={summaryHeader(R.prop('lastUpdate', partner))}
      loading={loading}
    >
      {fields(partner, button)}
    </HeaderList>
  );
};

PartnerOverviewSummary.propTypes = {
  partner: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  button: PropTypes.bool,
};

PartnerOverviewSummary.defaultProps = {
  partner: {},
};

export default PartnerOverviewSummary;
