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
import { selectNormalizedOrganizationTypes } from '../../store';

const messages = {
  choose: 'Select applicable filter to generate a report of Partner profiles, ' +
  'a list of Partner contact information and to map Partners in the target Country Office',
  labels: {
    search: 'submit',
    country: 'Country',
    location: 'Location',
    registration: 'Registration status',
    typeLabel: 'Type of organization',
    typePlaceholder: 'Select type',
    sector: 'Sector and area of specialization',
    experience: 'UN Experience',
  },
  clear: 'clear',
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

class AgencyMembersFilter extends Component {
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

    const { office_name, name } = values;

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        page: 1,
        office_name,
        name,
      }),
    });
  }

  render() {
    const { classes, handleSubmit, reset, organizationTypes } = this.props;

    return (
      <form onSubmit={handleSubmit}>
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
            <Grid item sm={4} xs={12}>
              <SectorForm
                fieldName="Sector and area of specialization"
                formName="tableFilter"
                label={messages.labels.location}
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

AgencyMembersFilter.propTypes = {
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  pathName: PropTypes.string,
  query: PropTypes.object,
  organizationTypes: PropTypes.array.isRequired,
};

const formAgencyMembersFilter = reduxForm({
  form: 'tableFilter',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(AgencyMembersFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { name } = {} } = ownProps.location;
  const { query: { office_name } = {} } = ownProps.location;

  return {
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    initialValues: {
      name,
      office_name,
    },
    organizationTypes: selectNormalizedOrganizationTypes(state),
  };
};

const connected = connect(mapStateToProps, null)(formAgencyMembersFilter);
const withRouterFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'AgencyMembersFilter' })(withRouterFilter));
