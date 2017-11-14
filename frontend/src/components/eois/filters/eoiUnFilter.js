import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import CheckboxForm from '../../forms/checkboxForm';
import SelectForm from '../../forms/selectForm';
import TextFieldForm from '../../forms/textFieldForm';
import Agencies from '../../forms/fields/projectFields/agencies';
import { selectNormalizedSpecializations, selectNormalizedCountries, selectNormalizedDirectSelectionSource } from '../../../store';
import resetChanges from './eoiHelper';

const messages = {
  choose: 'Choose',
  labels: {
    search: 'Search',
    country: 'Country',
    location: 'Location',
    sector: 'Sector & Area of Specialization',
    agency: 'Agency',
    show: 'Show only those chosen for "direct selection"',
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

    history.push({
      pathname: pathName,
      query: R.merge(query,
        { agency: agencyId },
      ),
    });
  }

  onSearch(values) {
    const { pathName, query } = this.props;

    const { project_title, agency, active, country_code,
      specialization, selected_source, ds_converted } = values;

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        project_title,
        agency,
        active,
        country_code,
        specialization,
        selected_source,
        ds_converted,
      }),
    });
  }

  render() {
    const { classes, countries, specs, handleSubmit, reset } = this.props;

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
              <SelectForm
                fieldName="country_code"
                label={messages.labels.country}
                values={countries}
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <SelectForm
                fieldName="sector"
                label={messages.labels.location}
                placeholder={messages.choose}
                values={[]}
                optional
              />
            </Grid>
          </Grid>
          <Grid container direction="row" >
            <Grid item sm={4} xs={12} >
              <SelectForm
                label={messages.labels.sector}
                placeholder={messages.labels.choose}
                fieldName="specialization"
                values={specs}
                optional
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <Agencies
                fieldName="agency"
                label={messages.labels.agency}
                placeholder={messages.choose}
                optional
              />
            </Grid>
            <Grid item sm={5} xs={12}>
              <CheckboxForm
                label={messages.labels.show}
                fieldName="ds_converted"
                optional
                warn
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

EoiFilter.propTypes = {
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
  specs: PropTypes.array.isRequired,
  pathName: PropTypes.string,
  agencyId: PropTypes.string,
  query: PropTypes.object,
};

const formEoiFilter = reduxForm({
  form: 'unsolicitedFilter',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
})(EoiFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { project_title } = { } } = ownProps.location;
  const { query: { country_code } = { } } = ownProps.location;
  const { query: { agency } = { } } = ownProps.location;
  const { query: { specialization } = { } } = ownProps.location;
  const { query: { selected_source } = { } } = ownProps.location;
  const { query: { ds_converted } = { } } = ownProps.location;

  return {
    countries: selectNormalizedCountries(state),
    specs: selectNormalizedSpecializations(state),
    directSources: selectNormalizedDirectSelectionSource(state),
    pathName: ownProps.location.pathname,
    agencyId: state.session.agencyId,
    query: ownProps.location.query,
    initialValues: {
      project_title,
      country_code,
      agency,
      specialization,
      selected_source,
      ds_converted,
    },
  };
};

const connected = connect(mapStateToProps, null)(formEoiFilter);
const withRouterEoiFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'formEoiFilter' })(withRouterEoiFilter));
