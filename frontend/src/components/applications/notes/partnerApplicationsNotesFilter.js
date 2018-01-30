import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import SelectForm from '../../forms/selectForm';
import TextFieldForm from '../../forms/textFieldForm';
import Agencies from '../../forms/fields/projectFields/agencies';
import AdminOneLocation from '../../forms/fields/projectFields/adminOneLocations';
import CountryField from '../../forms/fields/projectFields/locationField/countryField';
import { selectMappedSpecializations,
  selectNormalizedExtendedApplicationStatuses } from '../../../store';
import resetChanges from '../../eois/filters/eoiHelper';

const messages = {
  choose: 'Choose',
  labels: {
    search: 'Search',
    country: 'Country',
    location: 'Location',
    sector: 'Sector & Area of Specialization',
    applications_status: 'Status',
    cnStatus: 'CN Status',
    agency: 'Agency',
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

class PartnerApplicationsNotesFilter extends Component {
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

    const { project_title, agency, country_code, specializations,
      posted_from_date, posted_to_date, applications_status, locations } = values;

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        page: 1,
        project_title,
        agency,
        applications_status,
        country_code,
        specializations: Array.isArray(specializations) ? specializations.join(',') : specializations,
        posted_from_date,
        posted_to_date,
        locations,
      }),
    });
  }


  resetForm() {
    const query = resetChanges(this.props.pathName, this.props.query);

    const { pathName } = this.props;

    history.push({
      pathname: pathName,
      query,
    });
  }

  render() {
    const { classes, countryCode, specs, handleSubmit, cnStatus, reset } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSearch)}>
        <div className={classes.filterContainer} >
          <Grid container direction="row" >
            <Grid item sm={4} xs={12} >
              <TextFieldForm
                label={messages.labels.search}
                placeholder={messages.labels.search}
                fieldName="project_title"
                optional
              />
            </Grid>
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
          </Grid>
          <Grid container direction="row" >
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
            <Grid item sm={2} xs={12}>
              <SelectForm
                label={messages.labels.cnStatus}
                placeholder={messages.labels.choose}
                fieldName="applications_status"
                values={cnStatus}
                optional
              />
            </Grid>
            <Grid item sm={2} xs={12}>
              <Agencies
                fieldName="agency"
                label={messages.labels.agency}
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
        </div>
      </form >
    );
  }
}

PartnerApplicationsNotesFilter.propTypes = {
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  specs: PropTypes.array.isRequired,
  cnStatus: PropTypes.array.isRequired,
  pathName: PropTypes.string,
  query: PropTypes.object,
};

const formPartnerApplicationsNotesFilter = reduxForm({
  form: 'tableFilter',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(PartnerApplicationsNotesFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { project_title } = {} } = ownProps.location;
  const { query: { country_code } = {} } = ownProps.location;
  const { query: { agency } = {} } = ownProps.location;
  const { query: { applications_status } = {} } = ownProps.location;
  const { query: { locations } = {} } = ownProps.location;
  const { query: { specializations } = {} } = ownProps.location;
  const { query: { posted_from_date } = {} } = ownProps.location;
  const { query: { posted_to_date } = {} } = ownProps.location;

  const agencyQ = agency ? Number(agency) : agency;

  const specializationsQ = specializations &&
      R.map(Number, specializations.split(','));

  return {
    specs: selectMappedSpecializations(state),
    cnStatus: selectNormalizedExtendedApplicationStatuses(state),
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    countryCode: country_code,
    initialValues: {
      project_title,
      country_code,
      agency: agencyQ,
      applications_status,
      locations,
      specializations: specializationsQ,
      posted_from_date,
      posted_to_date,
    },
  };
};

const connected = connect(mapStateToProps, null)(formPartnerApplicationsNotesFilter);
const withRouterFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'PartnerApplicationsNotesFilter' })(withRouterFilter));
