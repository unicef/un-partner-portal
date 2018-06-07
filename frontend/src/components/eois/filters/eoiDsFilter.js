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
import TextFieldForm from '../../forms/textFieldForm';
import Agencies from '../../forms/fields/projectFields/agencies';
import CountryField from '../../forms/fields/projectFields/locationField/countryField';
import AdminOneLocation from '../../forms/fields/projectFields/adminOneLocations';
import { selectMappedSpecializations, selectNormalizedCountries, selectNormalizedDirectSelectionSource } from '../../../store';
import resetChanges from './eoiHelper';

const messages = {
  choose: 'Choose',
  labels: {
    search: 'Search',
    country: 'Country',
    location: 'Location',
    status: 'Status',
    sector: 'Sector & Area of Specialization',
    agency: 'Agency',
    direct: 'Direct Selection Source',
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
    value: 'Dra',
    label: 'Unpublished',
  },
  {
    value: 'Ope',
    label: 'Active',
  },
  {
    value: 'Com',
    label: 'Finalized',
  },
];

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
    const ordering = this.props.query.status === 'Dra' ? 'created' : '-completed_date';

    history.push({
      pathname: pathName,
      query: R.merge(query,
        { ordering, agency },
      ),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (R.isEmpty(nextProps.query)) {
      const { pathname } = nextProps.location;

      const ordering = this.props.query.status === 'Dra' ? 'created' : '-completed_date';
      const agencyQ = R.is(Number, this.props.query.agency) ? this.props.query.agency : this.props.agencyId;

      history.push({
        pathname,
        query: R.merge(this.props.query,
          { status: this.props.query.status, ordering, agency: agencyQ },
        ),
      });
    }
  }

  onSearch(values) {
    const { pathName, query } = this.props;
    // TODO - move order to paginated list wrapper
    const { title, agency, status, country_code, specializations, selected_source } = values;

    const agencyQ = R.is(Number, agency) ? agency : this.props.agencyId;
    const ordering = status === 'Dra' ? 'created' : '-completed_date';

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        page: 1,
        title,
        agency: agencyQ,
        status,
        ordering,
        country_code,
        specializations: Array.isArray(specializations) ? specializations.join(',') : specializations,
        selected_source,
      }),
    });
  }

  resetForm() {
    const query = resetChanges(this.props.pathName, this.props.query);

    const { pathName, agencyId } = this.props;

    history.push({
      pathname: pathName,
      query: R.merge(query,
        { ordering: 'created', agency: agencyId },
      ),
    });
  }

  render() {
    const { classes, countryCode, directSources, specs, handleSubmit, reset } = this.props;

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
              <RadioForm
                fieldName="status"
                label={messages.labels.status}
                values={STATUS_VAL}
                optional
              />
            </Grid>
            <Grid item sm={2} xs={12}>
              <Agencies
                fieldName="agency"
                label={messages.labels.agency}
                placeholder={messages.choose}
                optional
              />
            </Grid>
            <Grid item sm={2} xs={12}>
              <SelectForm
                fieldName="selected_source"
                label={messages.labels.direct}
                placeholder={messages.choose}
                values={directSources}
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

EoiFilter.propTypes = {
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  specs: PropTypes.array.isRequired,
  directSources: PropTypes.array.isRequired,
  pathName: PropTypes.string,
  agencyId: PropTypes.number,
  query: PropTypes.object,
};

const formEoiFilter = reduxForm({
  form: 'directFilter',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(EoiFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { title } = {} } = ownProps.location;
  const { query: { country_code } = {} } = ownProps.location;
  const { query: { agency } = {} } = ownProps.location;
  const { query: { status } = {} } = ownProps.location;
  const { query: { specializations } = {} } = ownProps.location;
  const { query: { selected_source } = {} } = ownProps.location;

  const agencyQ = Number(agency);

  const specializationsQ = specializations &&
      R.map(Number, specializations.split(','));

  return {
    countries: selectNormalizedCountries(state),
    specs: selectMappedSpecializations(state),
    directSources: selectNormalizedDirectSelectionSource(state),
    agencyId: state.session.agencyId,
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    countryCode: country_code,
    initialValues: {
      title,
      country_code,
      agency: agencyQ,
      status,
      specializations: specializationsQ,
      selected_source,
    },
  };
};

const connected = connect(mapStateToProps, null)(formEoiFilter);
const withRouterEoiFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'formEoiFilter' })(withRouterEoiFilter));
