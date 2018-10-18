import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { Typography } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import { browserHistory as history, withRouter } from 'react-router';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { selectNormalizedOrganizationTypes, selectNormalizedFlagTypes, selectAllFlagCategoryChoices } from '../../../store';
import SelectForm from '../../forms/selectForm';
import CheckboxForm from '../../forms/checkboxForm';
import resetChanges from '../../eois/filters/eoiHelper';
import CountryField from '../../forms/fields/projectFields/locationField/countryField';

const messages = {
  select: 'Select filters to generate a report on partner verification and observations.',
  clear: 'clear',
  choose: 'Choose',
  labels: {
    search: 'submit',
    country: 'Country',
    typeLabel: 'Type of organization',
    verificationStatus: 'Verification Status',
    verificationYear: 'Verification Year',
    observationType: 'Observation Type',
    categoryOfRisk: 'Category of risk',
    year: 'Year',
    show: 'Show INGO HQ only',
    status: 'Status',
    typoOfOrg: 'Type of organization',
  },
};

const VERIFICATION_MENU = [
  {
    value: 'pending',
    label: 'Verification Pending',
  },
  {
    value: 'verified',
    label: 'Verification Passed',
  },
  {
    value: 'unverified',
    label: 'Verification Failed',
  },
];

const styleSheet = theme => ({
  filterContainer: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
    background: theme.palette.primary[300],
  },
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  info: {
    color: 'gray',
    fontWeight: '350',
    padding: '4px 0',
  },
});

export const STATUS_VAL = [
  {
    value: true,
    label: 'Yes',
  },
  {
    value: false,
    label: 'No',
  },
  {
    value: 'all',
    label: 'All',
  },
];

export const YEARS_VAL = [
  {
    value: '2018',
    label: '2018',
  },
];

class VerificationFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actionOnSubmit: {},
    };

    this.onSearch = this.onSearch.bind(this);
  }

  componentWillMount() {
    const { pathName, query } = this.props;

    history.push({
      pathname: pathName,
      query,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (R.isEmpty(nextProps.query)) {
      const { pathname } = nextProps.location;

      history.push({
        pathname,
        query: this.props.query,
      });
    }
  }

  onSearch(values) {
    const { pathName, query } = this.props;

    const { display_type, country_code, is_verified, verification_year, flag, flag_category, is_hq } = values;

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        page: 1,
        is_verified,
        country_code,
        display_type,
        flag,
        is_hq,
        verification_year,
        flag_category,
      }),
    });
  }

  render() {
    const { classes, handleSubmit, countryCode, reset, organizationTypes, flagTypes, categoryRisks } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Typography className={classes.info}> {messages.select} </Typography>
        <Grid item xs={12} className={classes.filterContainer} >
          <Grid container direction="row" >
            <Grid item sm={4} xs={12}>
              <CountryField
                initialValue={countryCode}
                fieldName="country_code"
                label={messages.labels.country}
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <SelectForm
                fieldName="display_type"
                label={messages.labels.typeLabel}
                values={organizationTypes}
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <SelectForm
                fieldName="is_verified"
                label={messages.labels.verificationStatus}
                values={VERIFICATION_MENU}
                optional
              />
            </Grid>
          </Grid>
          <Grid container direction="row" >
            <Grid item sm={4} xs={12}>
              <SelectForm
                fieldName="verification_year"
                label={messages.labels.verificationYear}
                values={YEARS_VAL}
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <SelectForm
                fieldName="flag"
                label={messages.labels.observationType}
                values={flagTypes}
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <SelectForm
                fieldName="flag_category"
                label={messages.labels.categoryOfRisk}
                values={categoryRisks}
                optional
              />
            </Grid>
          </Grid>
          <Grid container direction="row" >
            <Grid item sm={4} xs={12}>
              <CheckboxForm
                label={messages.labels.show}
                fieldName="is_hq"
                optional
              />
            </Grid>
          </Grid>
          <Grid item className={classes.button}>
            <Button
              color="accent"
              onTouchTap={() => { reset(); resetChanges(this.props.pathName, this.props.query); }}
            >
              {messages.clear}
            </Button>
            <Button
              color="accent"
              onTouchTap={handleSubmit(this.onSearch)}
            >
              {messages.labels.search}
            </Button>
          </Grid>
        </Grid>
      </form >
    );
  }
}

VerificationFilter.propTypes = {
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  categoryRisks: PropTypes.array.isRequired,
  flagTypes: PropTypes.array.isRequired,
  pathName: PropTypes.string,
  countryCode: PropTypes.string,
  handleSubmit: PropTypes.func,
  query: PropTypes.object,
  organizationTypes: PropTypes.array.isRequired,
};

const formVerificationFilter = reduxForm({
  form: 'formVerificationFilter',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(VerificationFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { country_code } = {} } = ownProps.location;
  const { query: { display_type } = {} } = ownProps.location;
  const { query: { is_verified } = {} } = ownProps.location;
  const { query: { verification_year } = {} } = ownProps.location;
  const { query: { flag } = {} } = ownProps.location;
  const { query: { flag_category } = {} } = ownProps.location;
  const { query: { is_hq } = {} } = ownProps.location;

  return {
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    organizationTypes: selectNormalizedOrganizationTypes(state),
    flagTypes: selectNormalizedFlagTypes(state),
    categoryRisks: selectAllFlagCategoryChoices(state),
    countryCode: country_code,
    initialValues: {
      is_verified,
      verification_year,
      flag_category,
      country_code,
      flag,
      is_hq,
      display_type,
    },
  };
};

const connected = connect(mapStateToProps, null)(formVerificationFilter);
const withRouterFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'VerificationFilter' })(withRouterFilter));
