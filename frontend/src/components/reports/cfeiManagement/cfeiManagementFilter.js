import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { Typography } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import { browserHistory as history, withRouter } from 'react-router/lib';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { selectNormalizedOrganizationTypes, selectMappedSpecializations } from '../../../store';
import SelectForm from '../../forms/selectForm';
import RadioForm from '../../forms/radioForm';
import resetChanges from '../../eois/filters/eoiHelper';
import CountryField from '../../forms/fields/projectFields/locationField/countryField';
import AdminOneLocation from '../../forms/fields/projectFields/adminOneLocations';

const messages = {
  select: 'Select applicable filters to generate a report on CFEI or a map of CFEI in the target Country Office.',
  clear: 'clear',
  choose: 'Choose',
  labels: {
    search: 'submit',
    country: 'Country',
    location: 'Project Location',
    typeLabel: 'Type of organization',
    typePlaceholder: 'Select type',
    sector: 'Sector & Area of Specialization',
    typeOfExp: 'Type of expression of interests',
    year: 'Year',
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
        <Typography className={classes.info}> {messages.select} </Typography>
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

CfeiManagementFilter.propTypes = {
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

const formCfeiManagementFilter = reduxForm({
  form: 'cfeiManagementFilter',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(CfeiManagementFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { name } = {} } = ownProps.location;
  const { query: { specializations } = {} } = ownProps.location;

  const specializationsQ = specializations &&
  R.map(Number, specializations.split(','));

  return {
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    specs: selectMappedSpecializations(state),
    organizationTypes: selectNormalizedOrganizationTypes(state),
    initialValues: {
      name,
      specializations: specializationsQ,
    },
  };
};

const connected = connect(mapStateToProps, null)(formCfeiManagementFilter);
const withRouterFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'CfeiManagementFilter' })(withRouterFilter));
