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
import { selectMappedSpecializations, selectNormalizedCountries } from '../../store';
import resetChanges from '../eois/filters/eoiHelper';

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

  onSearch(values) {
    const { pathName, query } = this.props;

    const { project_title, agency, did_win, country_code, specialization, eoi } = values;

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        project_title, agency, did_win, country_code, specialization, eoi,
      }),
    });
  }

  render() {
    const { classes, countries, eoiTypes, specs, handleSubmit, reset } = this.props;

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
                label={messages.labels.sector}
                placeholder={messages.labels.choose}
                fieldName="specializations"
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
                fieldName="agency"
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

PartnerApplicationListFilter.propTypes = {
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
  specs: PropTypes.array.isRequired,
  eoiTypes: PropTypes.array.isRequired,
  pathName: PropTypes.string,
  query: PropTypes.object,
};

const formEoiFilter = reduxForm({
  form: 'partnerApplicationsForm',
})(PartnerApplicationListFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { project_title } = {} } = ownProps.location;
  const { query: { country_code } = {} } = ownProps.location;
  const { query: { agency } = {} } = ownProps.location;
  const { query: { did_win } = {} } = ownProps.location;
  const { query: { specialization } = {} } = ownProps.location;
  const { query: { eoi } = {} } = ownProps.location;


  return {
    countries: selectNormalizedCountries(state),
    specs: selectMappedSpecializations(state),
    eoiTypes: [],
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    initialValues: {
      project_title,
      country_code,
      agency,
      did_win,
      specialization,
      eoi,
    },
  };
};

const connected = connect(mapStateToProps, null)(formEoiFilter);
const withRouterEoiFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'partnerApplicationsFilter' })(withRouterEoiFilter));
