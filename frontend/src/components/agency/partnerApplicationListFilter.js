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
import { selectNormalizedSpecializations } from '../../store';
import resetChanges from '../eois/filters/eoiHelper';
import CountryField from '../forms/fields/projectFields/locationField/countryField';

const messages = {
  choose: 'Choose',
  labels: {
    search: 'Search',
    country: 'Country',
    sector: 'Sector & Area of specialization',
    type: 'Type of Application',
    agency: 'Agency',
    show: 'Show Only Awarded Applications',
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

    const { title, agency, did_win, country_code, specializations, eoi_type } = values;

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        title, agency, did_win, country_code, specializations, eoi_type,
      }),
    });
  }

  render() {
    const { classes, eoiTypes, specs, handleSubmit, reset } = this.props;

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
                values={specs}
                optional
              />
            </Grid>
          </Grid>
          <Grid container direction="row" >
            <Grid item sm={3} xs={12} >
              <SelectForm
                label={messages.labels.type}
                placeholder={messages.labels.choose}
                fieldName="eoi_type"
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
  specs: PropTypes.array.isRequired,
  eoiTypes: PropTypes.array.isRequired,
  pathName: PropTypes.string,
  query: PropTypes.object,
};

const formEoiFilter = reduxForm({
  form: 'partnerApplicationsForm',
})(PartnerApplicationListFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { title } = { } } = ownProps.location;
  const { query: { country_code } = { } } = ownProps.location;
  const { query: { agency } = { } } = ownProps.location;
  const { query: { did_win } = { } } = ownProps.location;
  const { query: { specializations } = { } } = ownProps.location;
  const { query: { eoi_type } = { } } = ownProps.location;


  return {
    specs: selectNormalizedSpecializations(state),
    eoiTypes: [],
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    initialValues: {
      title,
      country_code,
      agency,
      did_win,
      specializations,
      eoi_type,
    },
  };
};

const connected = connect(mapStateToProps, null)(formEoiFilter);
const withRouterEoiFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'partnerApplicationsFilter' })(withRouterEoiFilter));
