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
import CheckboxForm from '../../forms/checkboxForm';
import RadioForm from '../../forms/radioForm';
import CountryField from '../../forms/fields/projectFields/locationField/countryField';
import AdminOneLocation from '../../forms/fields/projectFields/adminOneLocations';
import SelectForm from '../../forms/selectForm';
import resetChanges from '../../eois/filters/eoiHelper';
import { saveSelections } from '../../../reducers/selectableListItems';
import { selectNormalizedOrganizationTypes, selectMappedSpecializations } from '../../../store';

const messages = {
  select: 'Select filters to generate reports on partners and partner contact information, or a map of partner presence.',
  clear: 'clear',
  choose: 'Choose',
  labels: {
    search: 'submit',
    country: 'Country',
    location: 'Location',
    registration: 'Registered in country',
    typeLabel: 'Type of organization',
    typePlaceholder: 'Select type',
    sector: 'Sector & Area of Specialization',
    experience: 'UN Experience',
    show: 'Show INGO HQ only',
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

    const { country_code, specializations, organization_type, display_types,
      has_experience, registered, locations, is_hq } = values;

    this.props.saveSelectedItems([]);
    this.props.clearSelections();

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        page: 1,
        is_hq,
        country_code,
        organization_type,
        display_types: Array.isArray(display_types) ? display_types.join(',') : display_types,
        registered,
        has_experience,
        specializations: Array.isArray(specializations) ? specializations.join(',') : specializations,
        locations,
      }),
    });
  }

  resetForm() {
    this.props.saveSelectedItems([]);
    this.props.clearSelections();
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
                formName="formPartnerFilter"
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
                fieldName="display_types"
                label={messages.labels.typeLabel}
                placeholder={messages.labels.typePlaceholder}
                values={organizationTypes}
                multiple
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
  countryCode: PropTypes.string,
  handleSubmit: PropTypes.func,
  saveSelectedItems: PropTypes.func.isRequired,
  clearSelections: PropTypes.func.isRequired,
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
  const { query: { display_types } = {} } = ownProps.location;
  const { query: { registered } = {} } = ownProps.location;
  const { query: { has_experience } = {} } = ownProps.location;
  const { query: { locations } = {} } = ownProps.location;
  const { query: { is_hq } = {} } = ownProps.location;

  const specializationsQ = specializations &&
  R.map(Number, specializations.split(','));

  const displayTypeQ = display_types &&
  R.map(String, display_types.split(','));

  return {
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    specs: selectMappedSpecializations(state),
    organizationTypes: selectNormalizedOrganizationTypes(state),
    countryCode: country_code,
    initialValues: {
      country_code,
      specializations: specializationsQ,
      display_types: displayTypeQ,
      registered,
      is_hq,
      has_experience,
      locations: locations && Number(locations),
    },
  };
};

const mapDispatch = dispatch => ({
  saveSelectedItems: items => dispatch(saveSelections(items)),
});

const connected = connect(mapStateToProps, mapDispatch)(formPartnerInfoFilter);
const withRouterFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'PartnerInfoFilter' })(withRouterFilter));
