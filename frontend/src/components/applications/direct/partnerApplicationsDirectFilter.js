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
import Agencies from '../../forms/fields/projectFields/agencies';
import CountryField from '../../forms/fields/projectFields/locationField/countryField';
import { selectMappedSpecializations } from '../../../store';
import resetChanges from '../../eois/filters/eoiHelper';

const messages = {
  choose: 'Choose',
  labels: {
    search: 'Search',
    country: 'Country',
    location: 'Location - Admin 1',
    agency: 'Agency',
    sector: 'Sector & Area of Specialization',
    fromDate: 'From date',
    toDate: 'To date',
    date: 'Date posted - choose date range',
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

    const { agency, country_code, specializations } = values;

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        page: 1,
        agency,
        country_code,
        specializations: Array.isArray(specializations) ? specializations.join(',') : specializations,
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
    const { classes, countryCode, specs, handleSubmit, reset } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSearch)}>
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
            <Grid item sm={4} xs={12} >
              <SelectForm
                label={messages.labels.sector}
                placeholder={messages.choose}
                fieldName="specializations"
                values={specs}
                multiple
                sections
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
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
        </Grid>
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
  const { query: { country_code } = {} } = ownProps.location;
  const { query: { agency } = {} } = ownProps.location;
  const { query: { specializations } = {} } = ownProps.location;

  const agencyQ = agency ? Number(agency) : agency;

  const specializationsQ = specializations &&
      R.map(Number, specializations.split(','));

  return {
    specs: selectMappedSpecializations(state),
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    countryCode: country_code,
    initialValues: {
      country_code,
      agency: agencyQ,
      specializations: specializationsQ,
    },
  };
};

const connected = connect(mapStateToProps, null)(formPartnerApplicationsNotesFilter);
const withRouterFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'PartnerApplicationsNotesFilter' })(withRouterFilter));
