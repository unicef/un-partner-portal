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
import { selectNormalizedCfeiStatuses, selectMappedSpecializations, selectNormalizedCfeiTypes } from '../../../store';
import SelectForm from '../../forms/selectForm';
import resetChanges from '../../eois/filters/eoiHelper';
import CountryField from '../../forms/fields/projectFields/locationField/countryField';
import AdminOneLocation from '../../forms/fields/projectFields/adminOneLocations';
import { saveSelections } from '../../../reducers/selectableListItems';

const messages = {
  select: 'Select filters to generate a report or map of CFEIs and direct selection/retention.',
  clear: 'clear',
  choose: 'Choose',
  labels: {
    search: 'submit',
    country: 'Country',
    location: 'Project Location',
    typeLabel: 'Type of organization',
    typePlaceholder: 'Select type',
    sector: 'Sector & Area of Specialization',
    cfeiType: 'Type of expression of interest',
    typeOfExp: 'Type of expression of interests',
    year: 'Year',
    yearPlaceholder: 'Select year',
    status: 'Status',
    typoOfOrg: 'Type of organization',
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

export const YEARS_VAL = [
  {
    value: '2018',
    label: '2018',
  },
];

class CfeiManagementFilter extends Component {
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

    const { country_code, locations, specializations, status, posted_year, display_type } = values;
    this.props.saveSelectedItems([]);
    this.props.clearSelections();

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        page: 1,
        posted_year,
        display_type,
        country_code,
        status,
        locations,
        specializations: Array.isArray(specializations) ? specializations.join(',') : specializations,
      }),
    });
  }

  resetForm() {
    this.props.saveSelectedItems([]);
    this.props.clearSelections();

    resetChanges(this.props.pathName, this.props.query);
  }

  render() {
    const { classes, handleSubmit, countryCode, reset, cfeiTypes, specs,
      applicationStatuses } = this.props;

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
                formName="cfeiManagementFilter"
                observeFieldName="country_code"
                label={messages.labels.location}
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
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
          </Grid>
          <Grid container direction="row" >
            <Grid item sm={4} xs={12}>
              <SelectForm
                fieldName="posted_year"
                label={messages.labels.year}
                placeholder={messages.labels.yearPlaceholder}
                values={YEARS_VAL}
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12} >
              <SelectForm
                label={messages.labels.cfeiType}
                placeholder={messages.labels.choose}
                fieldName="display_type"
                values={cfeiTypes}
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <SelectForm
                label={messages.labels.status}
                placeholder={messages.labels.choose}
                fieldName="status"
                values={applicationStatuses}
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

CfeiManagementFilter.propTypes = {
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  specs: PropTypes.array.isRequired,
  pathName: PropTypes.string,
  countryCode: PropTypes.string,
  handleSubmit: PropTypes.func,
  query: PropTypes.object,
  cfeiTypes: PropTypes.array.isRequired,
  saveSelectedItems: PropTypes.func.isRequired,
  clearSelections: PropTypes.func.isRequired,
  applicationStatuses: PropTypes.array.isRequired,
};

const formCfeiManagementFilter = reduxForm({
  form: 'cfeiManagementFilter',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(CfeiManagementFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { specializations } = {} } = ownProps.location;
  const { query: { country_code } = {} } = ownProps.location;
  const { query: { locations } = {} } = ownProps.location;
  const { query: { posted_year } = {} } = ownProps.location;
  const { query: { status } = {} } = ownProps.location;
  const { query: { display_type } = {} } = ownProps.location;

  const specializationsQ = specializations &&
  R.map(Number, specializations.split(','));

  return {
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    countryCode: country_code,
    specs: selectMappedSpecializations(state),
    cfeiTypes: selectNormalizedCfeiTypes(state),
    applicationStatuses: selectNormalizedCfeiStatuses(state),
    initialValues: {
      country_code,
      status,
      locations,
      posted_year,
      display_type,
      specializations: specializationsQ,
    },
  };
};

const mapDispatch = dispatch => ({
  saveSelectedItems: items => dispatch(saveSelections(items)),
});

const connected = connect(mapStateToProps, mapDispatch)(formCfeiManagementFilter);
const withRouterFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'CfeiManagementFilter' })(withRouterFilter));
