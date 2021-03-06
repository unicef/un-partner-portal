import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import CheckboxForm from '../forms/checkboxForm';
import SelectForm from '../forms/selectForm';
import TextFieldForm from '../forms/textFieldForm';
import CountryField from '../forms/fields/projectFields/locationField/countryField';
import { selectNormalizedPopulationsOfConcernGroups, selectMappedSpecializations, selectNormalizedCountries, selectNormalizedOrganizationTypes } from '../../store';
import resetChanges from '../eois/filters/eoiHelper';

const messages = {
  choose: 'Choose',
  labels: {
    name: 'Legal Name',
    country: 'Country',
    verificationStatus: 'Verification Status',
    typeOfOrganization: 'Type of Organization',
    sectorArea: 'Sector & Area of Specialization',
    populations: 'Populations of concern',
    show: 'Show International CSO HQ only',
  },
  clear: 'clear',
  submit: 'submit',
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
});

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

class PartnersFilter extends Component {
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

    const { legal_name, is_verified, display_type,
      country_code, specializations, concern, is_hq } = values;

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        page: 1,
        legal_name,
        is_verified,
        display_type,
        country_code,
        specializations: Array.isArray(specializations) ? specializations.join(',') : specializations,
        concern,
        is_hq,
      }),
    });
  }

  resetForm() {
    resetChanges(this.props.pathName, this.props.query);
  }

  render() {
    const {
      classes,
      countryCode,
      countries,
      partnersType,
      concernGroups,
      specs,
      handleSubmit,
      reset,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSearch)}>
        <Grid item xs={12} className={classes.filterContainer} >
          <Grid container direction="row" >
            <Grid item sm={4} xs={12} >
              <TextFieldForm
                label={messages.labels.name}
                fieldName="legal_name"
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
            <Grid item sm={4} xs={12}>
              <SelectForm
                fieldName="display_type"
                label={messages.labels.typeOfOrganization}
                values={partnersType}
                optional
              />
            </Grid>
          </Grid>
          <Grid container direction="row" >
            <Grid item sm={4} xs={12} >
              <CountryField
                initialValue={countryCode}
                fieldName="country_code"
                label={messages.labels.country}
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <SelectForm
                label={messages.labels.sectorArea}
                placeholder={messages.labels.choose}
                fieldName="specializations"
                multiple
                values={specs}
                sections
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <SelectForm
                fieldName="concern"
                label={messages.labels.populations}
                values={concernGroups}
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
              onTouchTap={() => { reset(); this.resetForm(); }}
            >
              {messages.clear}
            </Button>
            <Button
              color="accent"
              onTouchTap={handleSubmit(this.onSearch)}
            >
              {messages.submit}
            </Button>
          </Grid>
        </Grid>
      </form >
    );
  }
}

PartnersFilter.propTypes = {
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
  specs: PropTypes.array.isRequired,
  partnersType: PropTypes.array.isRequired,
  concernGroups: PropTypes.array.isRequired,
  pathName: PropTypes.string,
  query: PropTypes.object,
};

const formPartnersFilter = reduxForm({
  form: 'partnersFilter',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(PartnersFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { legal_name } = {} } = ownProps.location;
  const { query: { is_verified } = {} } = ownProps.location;
  const { query: { display_type } = {} } = ownProps.location;
  const { query: { country_code } = {} } = ownProps.location;
  const { query: { specializations } = {} } = ownProps.location;
  const { query: { concern } = {} } = ownProps.location;
  const { query: { is_hq } = {} } = ownProps.location;

  const specializationsQ = specializations &&
    R.map(Number, specializations.split(','));

  return {
    countries: selectNormalizedCountries(state),
    partnersType: selectNormalizedOrganizationTypes(state),
    specs: selectMappedSpecializations(state),
    concernGroups: selectNormalizedPopulationsOfConcernGroups(state),
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    countryCode: country_code,
    initialValues: {
      legal_name,
      is_verified,
      display_type,
      country_code,
      specializations: specializationsQ,
      concern,
      is_hq,
    },
  };
};

const connected = connect(mapStateToProps, null)(formPartnersFilter);
const withRouterPartnersFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'partnersFilter' })(withRouterPartnersFilter));
