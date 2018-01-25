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
import { selectMappedSpecializations, selectNormalizedCountries } from '../../../store';
import resetChanges from './eoiHelper';

const messages = {
  choose: 'Choose',
  labels: {
    search: 'Search',
    country: 'Country',
    location: 'Location',
    sector: 'Sector & Area of Specialization',
    agency: 'UN Agency',
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

export const STATUS_VAL = [
  {
    value: true,
    label: 'Active',
  },
  {
    value: false,
    label: 'Finalized',
  },
];

class EoiPartnerFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actionOnSubmit: {},
    };

    this.onSearch = this.onSearch.bind(this);
  }

  componentWillMount() {
    const { pathName, query } = this.props;

    const ordering = 'deadline_date';

    history.push({
      pathname: pathName,
      query: R.merge(query,
        { ordering },
      ),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (R.isEmpty(nextProps.query)) {
      const { pathname } = nextProps.location;
      const ordering = 'deadline_date';

      history.push({
        pathname,
        query: R.merge(this.props.query, { ordering }),
      });
    }
  }

  onSearch(values) {
    const { pathName, query } = this.props;

    const { title, agency, active, country_code, specializations,
      posted_from_date, posted_to_date, locations } = values;
    const ordering = 'deadline_date';

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        title,
        active,
        agency,
        ordering,
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
      query: R.merge(query,
        { ordering: 'deadline_date' },
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
            <Grid item sm={4} xs={12}>
              <Agencies
                fieldName="agency"
                label={messages.labels.agency}
                placeholder={messages.choose}
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

EoiPartnerFilter.propTypes = {
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
  specs: PropTypes.array.isRequired,
  pathName: PropTypes.string,
  query: PropTypes.object,
};

const formEoiPartnerFilter = reduxForm({
  form: 'tableFilter',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(EoiPartnerFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { title } = {} } = ownProps.location;
  const { query: { country_code } = {} } = ownProps.location;
  const { query: { agency } = null } = ownProps.location;
  const { query: { active } = {} } = ownProps.location;
  const { query: { locations } = {} } = ownProps.location;
  const { query: { specializations } = {} } = ownProps.location;
  const { query: { posted_from_date } = {} } = ownProps.location;
  const { query: { posted_to_date } = {} } = ownProps.location;

  const agencyQ = agency && Number(agency);

  const specializationsQ = specializations &&
      R.map(Number, specializations.split(','));

  return {
    countries: selectNormalizedCountries(state),
    specs: selectMappedSpecializations(state),
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    countryCode: country_code,
    initialValues: {
      title,
      country_code,
      agency: agencyQ,
      active,
      locations,
      specializations: specializationsQ,
      posted_from_date,
      posted_to_date,
    },
  };
};

const connected = connect(mapStateToProps, null)(formEoiPartnerFilter);
const withRouterEoiPartnerFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'formEoiPartnerFilter' })(withRouterEoiPartnerFilter));
