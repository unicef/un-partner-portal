import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import SelectForm from '../forms/selectForm';
import CheckboxForm from '../forms/checkboxForm';
import TextFieldForm from '../forms/textFieldForm';
import Agencies from '../forms/fields/projectFields/agencies';
import { selectMappedSpecializations, selectNormalizedCountries, selectNormalizedCfeiTypes } from '../../store';
import resetChanges from '../eois/filters/eoiHelper';
import CountryField from '../forms/fields/projectFields/locationField/countryField';

const messages = {
  choose: 'Choose',
  labels: {
    search: 'Search',
    country: 'Country',
    sector: 'Sector & Area of Specialization',
    type: 'Type of Application',
    agency: 'Agency',
    show: 'Show Only Selected Applications',
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

class PartnerApplicationListFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actionOnSubmit: {},
    };

    this.onSearch = this.onSearch.bind(this);
  }

  componentWillMount() {
    const { pathName, query, agencyId } = this.props;

    const agency = this.props.query.agency_app ? this.props.query.agency_app : agencyId;

    history.push({
      pathname: pathName,
      query: R.merge(query,
        { agency_app: agency },
      ),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (R.isEmpty(nextProps.query)) {
      const { pathname } = nextProps.location;
      const agencyQ = R.is(Number, this.props.query.agency_app) ? this.props.query.agency_app : this.props.agencyId;

      history.push({
        pathname,
        query: R.merge(this.props.query,
          { agency_app: agencyQ },
        ),
      });
    }
  }

  onSearch(values) {
    const { pathName, query } = this.props;

    const { project_title, agency_app, did_win, country_code, specializations, eoi } = values;
    const agencyQ = R.is(Number, agency_app) ? agency_app : this.props.agencyId;

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        page: 1,
        project_title,
        agency_app: agencyQ,
        did_win,
        country_code,
        specializations: Array.isArray(specializations) ? specializations.join(',') : specializations,
        eoi,
      }),
    });
  }

  resetForm() {
    const query = resetChanges(this.props.pathName, this.props.query);

    const { pathName, agencyId } = this.props;

    history.push({
      pathname: pathName,
      query: R.merge(query,
        { agency_app: agencyId },
      ),
    });
  }

  render() {
    const { classes, countryCode, eoiTypes, specs, handleSubmit, reset } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSearch)}>
        <Grid item xs={12} className={classes.filterContainer} >
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
            <Grid item sm={3} xs={12} >
              <SelectForm
                label={messages.labels.type}
                placeholder={messages.labels.choose}
                fieldName="eoi"
                values={eoiTypes}
                optional
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <Agencies
                fieldName="agency_app"
                label={messages.labels.agency}
                placeholder={messages.choose}
                optional
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <CheckboxForm
                label={messages.labels.show}
                fieldName="did_win"
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

PartnerApplicationListFilter.propTypes = {
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  specs: PropTypes.array.isRequired,
  eoiTypes: PropTypes.array.isRequired,
  pathName: PropTypes.string,
  query: PropTypes.object,
  agencyId: PropTypes.number,
};

const formEoiFilter = reduxForm({
  form: 'partnerApplicationsForm',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(PartnerApplicationListFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { project_title } = {} } = ownProps.location;
  const { query: { country_code } = {} } = ownProps.location;
  const { query: { agency_app } = {} } = ownProps.location;
  const { query: { did_win } = {} } = ownProps.location;
  const { query: { specializations } = {} } = ownProps.location;
  const { query: { eoi } = {} } = ownProps.location;

  const agencyQ = Number(agency_app);

  const specializationsQ = specializations &&
      R.map(Number, specializations.split(','));

  return {
    countries: selectNormalizedCountries(state),
    specs: selectMappedSpecializations(state),
    eoiTypes: selectNormalizedCfeiTypes(state),
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    agencyId: state.session.agencyId,
    countryCode: country_code,
    initialValues: {
      project_title,
      country_code,
      agency_app: agencyQ,
      did_win,
      specializations: specializationsQ,
      eoi,
    },
  };
};

const connected = connect(mapStateToProps, null)(formEoiFilter);
const withRouterEoiFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'partnerApplicationsFilter' })(withRouterEoiFilter));
