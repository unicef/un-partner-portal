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
import RadioForm from '../../forms/radioForm';
import Agencies from '../../forms/fields/projectFields/agencies';
import { selectNormalizedSpecializations, selectNormalizedCountries, selectNormalizedApplicationStatuses } from '../../../store';
import resetChanges from '../../eois/filters/eoiHelper';

const messages = {
  choose: 'Choose',
  labels: {
    search: 'Search',
    country: 'Country',
    location: 'Location - Admin 1',
    status: 'CFEI Status',
    cnStatus: 'CN Status',
    agency: 'Agency',
    sector_area: 'Sector & Area of Specialization',
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

export const STATUS_VAL = [
  {
    value: true,
    label: 'Active',
  },
  {
    value: false,
    label: 'Completed',
  },
];

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
      query: R.merge(query,
        { cfei_active: true },
      ),
    });
  }

  onSearch(values) {
    const { pathName, query } = this.props;

    const { agency, country_code, specialization,
      cfei_active } = values;

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        agency,
        cfei_active,
        country_code,
        specialization }),
    });
  }

  render() {
    const { classes, countries, specs, handleSubmit, cnStatus, reset } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSearch)}>
        <Grid item xs={12} className={classes.filterContainer} >
          <Grid container direction="row" >
            <Grid item sm={4} xs={12}>
              <SelectForm
                fieldName="country_code"
                label={messages.labels.country}
                placeholder={messages.choose}
                values={countries}
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12} >
              <SelectForm
                label={messages.labels.sector}
                placeholder={messages.choose}
                fieldName="specialization"
                values={specs}
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
          <Grid container direction="row" >
            <Grid item sm={4} xs={12}>
              <RadioForm
                fieldName="cfei_active"
                label={messages.labels.status}
                values={STATUS_VAL}
                defaultValue
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

PartnerApplicationsNotesFilter.propTypes = {
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
  specs: PropTypes.array.isRequired,
  cnStatus: PropTypes.array.isRequired,
  pathName: PropTypes.string,
  query: PropTypes.object,
};

const formPartnerApplicationsNotesFilter = reduxForm({
  form: 'tableFilter',
})(PartnerApplicationsNotesFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { country_code } = { } } = ownProps.location;
  const { query: { agency } = { } } = ownProps.location;
  const { query: { cfei_active } = { } } = ownProps.location;
  const { query: { specialization } = { } } = ownProps.location;

  return {
    countries: selectNormalizedCountries(state),
    specs: selectNormalizedSpecializations(state),
    cnStatus: selectNormalizedApplicationStatuses(state),
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    initialValues: {
      country_code,
      agency,
      cfei_active,
      specialization,
    },
  };
};

const connected = connect(mapStateToProps, null)(formPartnerApplicationsNotesFilter);
const withRouterFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'PartnerApplicationsNotesFilter' })(withRouterFilter));
