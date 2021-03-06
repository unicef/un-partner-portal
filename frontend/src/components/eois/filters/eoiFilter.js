import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import { FormControl, FormLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import SelectForm from '../../forms/selectForm';
import DatePickerForm from '../../forms/datePickerForm';
import RadioForm from '../../forms/radioForm';
import TextFieldForm from '../../forms/textFieldForm';
import Agencies from '../../forms/fields/projectFields/agencies';
import AdminOneLocation from '../../forms/fields/projectFields/adminOneLocations';
import CountryField from '../../forms/fields/projectFields/locationField/countryField';
import { selectMappedSpecializations, selectNormalizedCountries } from '../../../store';
import FocalPoints from '../../forms/fields/projectFields/agencyMembersFields/focalPoints';
import resetChanges from './eoiHelper';
import { STATUS_VAL } from './eoiDsFilter';

const messages = {
  choose: 'Choose',
  labels: {
    search: 'Search',
    country: 'Country',
    location: 'Location',
    status: 'Status',
    sector: 'Sector & Area of Specialization',
    agency: 'UN Agency',
    fromDate: 'From date',
    toDate: 'To date',
    date: 'Date posted - choose date range',
    cfeiID: 'CFEI ID',
    focalPoint: 'CFEI Focal Point',
    select: 'Select',
  },
  clear: 'clear',
  submit: 'submit',
};

const FORM_NAME = 'eoiFilter';

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

class EoiFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actionOnSubmit: {},
    };

    this.onSearch = this.onSearch.bind(this);
  }

  componentWillMount() {
    const { pathName, query, agencyId } = this.props;

    const agency = this.props.query.agency ? this.props.query.agency : agencyId;

    history.push({
      pathname: pathName,
      query: R.merge(query,
        { agency },
      ),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (R.isEmpty(nextProps.query)) {
      const { pathname } = nextProps.location;
      const agencyQ = R.is(Number, this.props.query.agency) ? this.props.query.agency : this.props.agencyId;

      history.push({
        pathname,
        query: R.merge(this.props.query,
          { agency: agencyQ },
        ),
      });
    }
  }

  onSearch(values) {
    const { pathName, query } = this.props;

    const { title, agency, country_code, specializations,
      posted_from_date, posted_to_date, status, locations, displayID, focal_points } = values;

    const agencyQ = R.is(Number, agency) ? agency : this.props.agencyId;
    history.push({
      pathname: pathName,
      query: R.merge(query, {
        page: 1,
        title,
        displayID,
        agency: agencyQ,
        status,
        country_code,
        specializations: Array.isArray(specializations) ? specializations.join(',') : specializations,
        posted_from_date,
        posted_to_date,
        locations,
        focal_points: Array.isArray(focal_points) ? focal_points.join(',') : focal_points,
      }),
    });
  }

  resetForm() {
    const query = resetChanges(this.props.pathName, this.props.query);

    const { pathName, agencyId } = this.props;

    this._focalPoints.getWrappedInstance().reset();

    history.push({
      pathname: pathName,
      query: R.merge(query,
        { agency: agencyId },
      ),
    });
  }

  render() {
    const { classes, countryCode, countries, specs, handleSubmit, reset } = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSearch)}>
        <Grid item xs={12} className={classes.filterContainer} >
          <Grid container direction="row" >
            <Grid item sm={4} xs={12} >
              <TextFieldForm
                label={messages.labels.search}
                placeholder={messages.labels.search}
                fieldName="title"
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
                formName={FORM_NAME}
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
            <Grid item sm={4} xs={12} >
              <TextFieldForm
                label={messages.labels.cfeiID}
                fieldName="displayID"
                placeholder="Provide CFEI ID"
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <Agencies
                fieldName="agency"
                label={messages.labels.agency}
                placeholder={messages.choose}
                optional
              />
            </Grid>
          </Grid>
          <FormControl fullWidth>
            <FormLabel style={{ marginTop: '8px' }}>{messages.labels.date}</FormLabel>
            <Grid container direction="row" >
              <Grid item sm={2} xs={12} >
                <DatePickerForm
                  placeholder={messages.labels.fromDate}
                  fieldName="posted_from_date"
                  optional
                />
              </Grid>
              <Grid item sm={2} xs={12} >
                <DatePickerForm
                  placeholder={messages.labels.toDate}
                  fieldName="posted_to_date"
                  optional
                />
              </Grid>
              <Grid item style={{ marginTop: '-18px' }} sm={4} xs={12} >
                <FocalPoints
                  label={messages.labels.focalPoint}
                  placeholder={messages.labels.select}
                  ref={field => this._focalPoints = field}
                  formName={FORM_NAME}
                  fieldName="focal_points"
                  optional
                />
              </Grid>
              <Grid item style={{ marginTop: '-18px' }} sm={4} xs={12}>
                <RadioForm
                  fieldName="status"
                  label={messages.labels.status}
                  values={STATUS_VAL}
                  optional
                />
              </Grid>
            </Grid>
          </FormControl>

          <Grid item className={classes.button}>
            <Button
              color="accent"
              onTouchTap={() => { reset(); this.resetForm(); }}
            >
              {messages.clear}
            </Button>
            <Button
              type="submit"
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

EoiFilter.propTypes = {
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  specs: PropTypes.array.isRequired,
  pathName: PropTypes.string,
  agencyId: PropTypes.number,
  query: PropTypes.object,
};

const formEoiFilter = reduxForm({
  form: FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(EoiFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { title } = {} } = ownProps.location;
  const { query: { country_code } = {} } = ownProps.location;
  const { query: { agency } = {} } = ownProps.location;
  const { query: { status } = {} } = ownProps.location;
  const { query: { locations } = {} } = ownProps.location;
  const { query: { specializations } = {} } = ownProps.location;
  const { query: { posted_from_date } = {} } = ownProps.location;
  const { query: { posted_to_date } = {} } = ownProps.location;
  const { query: { displayID } = {} } = ownProps.location;
  const { query: { focal_points } = {} } = ownProps.location;
  const agencyQ = Number(agency);

  const specializationsQ = specializations &&
    R.map(Number, specializations.split(','));

  const focalPointsQ = focal_points &&
    R.map(Number, focal_points.split(','));

  return {
    countries: selectNormalizedCountries(state),
    specs: selectMappedSpecializations(state),
    agencyId: state.session.agencyId,
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    countryCode: country_code,
    initialValues: {
      displayID,
      title,
      country_code,
      agency: agencyQ,
      status,
      locations: locations && Number(locations),
      specializations: specializationsQ,
      posted_from_date,
      posted_to_date,
      focal_points: focalPointsQ,
    },
  };
};

const connected = connect(mapStateToProps, null)(formEoiFilter);
const withRouterEoiFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'formEoiFilter' })(withRouterEoiFilter));
