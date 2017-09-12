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
  },
  clear: 'clear',
};

const COUNTRY_MENU = [
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
              fieldName="country"
              label={messages.labels.country}
              values={COUNTRY_MENU}
              optional
            />
          </Grid>
          <Grid className={classes.button} item sm={4}>
            <Button
              color="accent"
              onTouchTap={reset}
            >
              {messages.clear}
            </Button>
          </Grid>
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
