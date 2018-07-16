import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { withStyles } from 'material-ui/styles';
import { Typography } from 'material-ui';
import { browserHistory as history, withRouter } from 'react-router';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import RadioForm from '../../forms/radioForm';
import CountryField from '../../forms/fields/projectFields/locationField/countryField';
import AdminOneLocation from '../../forms/fields/projectFields/adminOneLocations';
import SelectForm from '../../forms/selectForm';
import resetChanges from '../../eois/filters/eoiHelper';
import { selectNormalizedOrganizationTypes, selectMappedSpecializations } from '../../../store';

const messages = {
  select: 'Select applicable filters to generate a report of Partner profiles, ' +
  'a list of Partner contact information and to map Partners in the target Country Office.',
  clear: 'clear',
  choose: 'Choose',
  labels: {
    search: 'submit',
    country: 'Country',
    location: 'Location',
    registration: 'Registration in country',
    typeLabel: 'Type of organization',
    typePlaceholder: 'Select type',
    sector: 'Sector & Area of Specialization',
    experience: 'UN Experience',
  },
};

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
    value: undefined,
    label: 'All',
  },
];

class PartnerInfoFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actionOnSubmit: {},
    };

    this.onSearch = this.onSearch.bind(this);
  }

  componentWillMount() {
    const { pathName, query } = this.props;
    
    resetChanges(pathName, query);

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

    const { country_code, specializations, organization_type, display_type,
      has_experience, registered } = values;
 
    history.push({
      pathname: pathName,
      query: R.merge(query, {
        page: 1,
        country_code,
        organization_type,
        display_type,
        registered,
        has_experience,
        specializations: Array.isArray(specializations) ? specializations.join(',') : specializations,
      }),
    });
  }

  resetForm() {
    resetChanges(this.props.pathName, this.props.query);
  }

  render() {
    const { classes, handleSubmit, countryCode, reset, organizationTypes, specs } = this.props;
    
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
              <AdminOneLocation
                fieldName="locations"
                formName="tableFilter"
                observeFieldName="country_code"
                label={messages.labels.location}
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <RadioForm
                fieldName="registered"
                label={messages.labels.registration}
                values={STATUS_VAL}
                optional
              />
            </Grid>
          </Grid>
          <Grid container direction="row" >
            <Grid item sm={4} xs={12}>
              <SelectForm
                fieldName="display_type"
                label={messages.labels.typeLabel}
                placeholder={messages.labels.typePlaceholder}
                values={organizationTypes}
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12} >
              <SelectForm
                label={messages.labels.sector}
                placeholder={messages.labels.choose}
                fieldName="specializations"
                multiple
                values={specs}
                sections
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <RadioForm
                fieldName="has_experience"
                label={messages.labels.experience}
                values={STATUS_VAL}
                optional
              />
            </Grid>
          </Grid>
          <Grid item className={classes.button}>
            <Button
              color="accent"
              onTouchTap={() => { reset(); this.resetForm(); }}
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

PartnerInfoFilter.propTypes = {
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  specs: PropTypes.array.isRequired,
  pathName: PropTypes.string,
  query: PropTypes.object,
  organizationTypes: PropTypes.array.isRequired,
};

const formPartnerInfoFilter = reduxForm({
  form: 'formPartnerFilter',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(PartnerInfoFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { specializations } = {} } = ownProps.location;
  const { query: { country_code } = {} } = ownProps.location;
  const { query: { display_type } = {} } = ownProps.location;
  const { query: { registered } = {} } = ownProps.location;
  const { query: { has_experience } = {} } = ownProps.location;

  const specializationsQ = specializations &&
  R.map(Number, specializations.split(','));

  return {
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    specs: selectMappedSpecializations(state),
    organizationTypes: selectNormalizedOrganizationTypes(state),
    countryCode: country_code,
    displayType: display_type,
    initialValues: {
      country_code,
      specializations: specializationsQ,
      display_type,
      registered,
      has_experience,
    },
  };
};

const connected = connect(mapStateToProps, null)(formPartnerInfoFilter);
const withRouterFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'PartnerInfoFilter' })(withRouterFilter));
