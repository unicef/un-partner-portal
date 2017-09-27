import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import SelectForm from '../../forms/selectForm';

const messages = {
  choose: 'Choose',
  labels: {
    choose: 'Choose',
    country: 'Country',
    agency: 'Agency',
    sector_area: 'Sector & Area of specialization',
  },
  clear: 'clear',
};

const SECTOR_AREA_MENU = [
  {
    value: 'food',
    label: 'Food Security',
  },
  {
    value: 'education',
    label: 'Education',
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

const AGENCY_MENU = [
  {
    value: 'unicef',
    label: 'UNICEF',
  },
  {
    value: 'wfp',
    label: 'WFP',
  },
];

const styleSheet = theme => ({
  filterContainer: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
    background: '#F6F6F6',
  },
  button: {
    padding: `${theme.spacing.unit * 2}px 0px 0px 0px`,
    textAlign: 'right',
  },
});

const handleSubmit = (values) => {

};

const PartnerApplicationsDirectFilter = (props) => {
  const { classes, handleSubmit, reset } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Grid item xs={12} className={classes.filterContainer} >
        <Grid container direction="row" >
          <Grid item sm={3} xs={12} >
            <SelectForm
              fieldName="country"
              label={messages.labels.country}
              values={COUNTRY_MENU}
              optional
            />
          </Grid>
          <Grid item sm={3} xs={12}>
            <SelectForm
              fieldName="sector_area"
              label={messages.labels.sector_area}
              values={SECTOR_AREA_MENU}
              placeholder={messages.labels.choose}
              option
            />
          </Grid>
          <Grid item sm={3} xs={12}>
            <SelectForm
              fieldName="agency"
              label={messages.labels.agency}
              values={AGENCY_MENU}
              placeholder={messages.labels.choose}
              optional
            />
          </Grid>
          <Grid item sm={3} xs={12}>
            <div className={classes.button}>
              <Button

                color="accent"
                onTouchTap={reset}
              >
                {messages.clear}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </form >
  );
};

PartnerApplicationsDirectFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
};

const formPartnerApplicationsDirectFilter = reduxForm({
  form: 'partnerApplicationsNotesFilter',
  handleSubmit,
})(PartnerApplicationsDirectFilter);

export default withStyles(styleSheet, { name: 'PartnerApplicationsDirectFilter' })(formPartnerApplicationsDirectFilter);
