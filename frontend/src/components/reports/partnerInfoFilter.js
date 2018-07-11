import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { withStyles } from 'material-ui/styles';
import { browserHistory as history, withRouter } from 'react-router';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import TextFieldForm from '../forms/textFieldForm';
import SectorForm from '../forms/fields/projectFields/sectorField/sectorFieldArray';
import RadioForm from '../forms/radioForm';
import CountryField from '../forms/fields/projectFields/locationField/countryField';
import AdminOneLocation from '../forms/fields/projectFields/adminOneLocations';
import SelectForm from '../forms/selectForm';
import resetChanges from '../eois/filters/eoiHelper';
import { selectNormalizedOrganizationTypes, selectMappedSpecializations } from '../../store';

const messages = {
  select: 'Select applicable filter to generate a report of Partner profiles, ' +
  'a list of Partner contact information and to map Partners in the target Country Office.',
  clear: 'clear',
  choose: 'Choose',
  labels: {
    search: 'submit',
    country: 'Country',
    location: 'Location',
    registration: 'Registration status',
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
  headerStyles: {
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

    const { office_name, country_code, name } = values;

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        page: 1,
        office_name,
        country_code,
        name,
      }),
    });
  }

  render() {
    const { classes, handleSubmit, reset, organizationTypes, specs } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className={classes.headerStyles}> {messages.select} </div>
        <Grid item xs={12} className={classes.filterContainer} >
          <Grid container direction="row" >
            <Grid item sm={4} xs={12}>
              <CountryField
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
                fieldName="registration_status"
                label={messages.labels.registration}
                values={STATUS_VAL}
                optional
              />
            </Grid>
          </Grid>
          <Grid container direction="row" >
            <Grid item sm={4} xs={12}>
              <SelectForm
                fieldName="organization_type"
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
                fieldName="un_experience"
                label={messages.labels.experience}
                values={STATUS_VAL}
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
  form: 'reportsFilter',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(PartnerInfoFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { name } = {} } = ownProps.location;
  const { query: { office_name } = {} } = ownProps.location;
  const { query: { agency } = {} } = ownProps.location;
  const { query: { active } = {} } = ownProps.location;
  const { query: { locations } = {} } = ownProps.location;
  const { query: { specializations } = {} } = ownProps.location;
  const { query: { posted_from_date } = {} } = ownProps.location;
  const { query: { posted_to_date } = {} } = ownProps.location;
  const agencyQ = Number(agency);

  const specializationsQ = specializations &&
  R.map(Number, specializations.split(','));

  return {
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    specs: selectMappedSpecializations(state),
    organizationTypes: selectNormalizedOrganizationTypes(state),
    initialValues: {
      name,
      office_name,
      specializations: specializationsQ,
    },
  };
};

const connected = connect(mapStateToProps, null)(formPartnerInfoFilter);
const withRouterFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'PartnerInfoFilter' })(withRouterFilter));
