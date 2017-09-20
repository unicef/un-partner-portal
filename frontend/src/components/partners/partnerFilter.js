import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

import SelectForm from '../forms/selectForm';
import TextFieldForm from '../forms/textFieldForm';

const messages = {
  choose: 'Choose',
  labels: {
    search: 'Search',
    country: 'Country',
    verificationStatus: 'Verification Status',
    typeOfOrganization: 'Type of Organization',
    sectorArea: 'Sector & Area of specialization',
    populations: 'Populations of concern',
  },
  clear: 'clear',
};

const VERIFICATION_MENU = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'pen',
    label: 'Pending',
  },
  {
    value: 'ver',
    label: 'Verified',
  },
  {
    value: 'un',
    label: 'Unverified',
  },
];

const ALL_MENU = [
  {
    value: 'all',
    label: 'All',
  },
];

const COUNTRY_MENU = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'pl',
    label: 'Poland',
  },
  {
    value: 'fr',
    label: 'France',
  },
  {
    value: 'it',
    label: 'Italy',
  },
];

const styleSheet = createStyleSheet('PartnerFilter', theme => ({
  filterContainer: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
    background: '#F6F6F6',
  },
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const handleSubmit = (values) => {

};

const PartnerFilter = (props) => {
  const { classes, handleSubmit, reset } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Grid item xs={12} className={classes.filterContainer} >
        <Grid container direction="row" >
          <Grid item sm={4} xs={12} >
            <TextFieldForm
              label={messages.labels.search}
              placeholder={messages.labels.search}
              fieldName="organizationName"
              optional
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <SelectForm
              fieldName="verificationStatus"
              label={messages.labels.verificationStatus}
              values={VERIFICATION_MENU}
              optional
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <SelectForm
              fieldName="typeOfOrganization"
              label={messages.labels.typeOfOrganization}
              values={ALL_MENU}
              optional
            />
          </Grid>

        </Grid>
        <Grid container direction="row" >
          <Grid item sm={4} xs={12} >
            <SelectForm
              fieldName="country"
              label={messages.labels.country}
              values={COUNTRY_MENU}
              optional
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <SelectForm
              fieldName="sector"
              label={messages.labels.sectorArea}
              values={ALL_MENU}
              optional
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <SelectForm
              fieldName="populations"
              label={messages.labels.populations}
              values={ALL_MENU}
              optional
            />
          </Grid>

        </Grid>
        <Grid className={classes.button} item sm={12}>
          <Button
            color="accent"
            onTouchTap={reset}
          >
            {messages.clear}
          </Button>
        </Grid>
      </Grid>
    </form >
  );
};

PartnerFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
};

const formPartnerFilter = reduxForm({
  form: 'tableFilter',
  handleSubmit,
})(PartnerFilter);

export default withStyles(styleSheet)(formPartnerFilter);
