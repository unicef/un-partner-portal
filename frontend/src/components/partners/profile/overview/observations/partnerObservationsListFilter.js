import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import SelectForm from '../../../../forms/selectForm';
import CheckboxForm from '../../../../forms/checkboxForm';
import { selectNormalizedFlagCategoryChoices, selectNormalizedFlagTypeChoices } from '../../../../../store';
import resetChanges from '../../../../eois/filters/eoiHelper';
import { FLAGS } from '../../../../../helpers/constants';
import ObservationIcon from '../../icons/observationIcon';
import FlagIcon from '../../icons/flagIcon';
import EscalatedIcon from '../../icons/escalatedIcon';

const messages = {
  choose: 'Choose',
  labels: {
    search: 'Search',
    typeObservation: 'Type of observation',
    category: 'Category of risk',
    show: 'Show only my observations',
  },
  clear: 'clear',
  submit: 'submit',
  flagObs: 'Not risk-related',
  flagYel: 'Risk flag',
  flagRed: 'Red flag',
  flagEsc: 'Risk flag escalated to UN Headquarters Editor',
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

class PartnerObservationsListFilter extends Component {
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

    const { category, type, only_mine } = values;

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        page: 1,
        category,
        type,
        only_mine,
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

  styleFlags() {
    const { observationsType } = this.props;

    return observationsType.map((item) => {
      if (item.value === FLAGS.OBSERVATION) {
        const label = (<div style={{ display: 'flex', alignItems: 'center' }}><ObservationIcon /> {messages.flagObs}</div>);
        return { value: item.value, label };
      } else if (item.value === FLAGS.YELLOW) {
        const label = (<div style={{ display: 'flex', alignItems: 'center' }}><FlagIcon color={FLAGS.YELLOW} /> {messages.flagYel}</div>);
        return { value: item.value, label };
      } else if (item.value === FLAGS.RED) {
        const label = (<div style={{ display: 'flex', alignItems: 'center' }}><FlagIcon color={FLAGS.RED} /> {messages.flagRed}</div>);
        return { value: item.value, label };
      } else if (item.value === FLAGS.ESCALATED) {
        const label = (<div style={{ display: 'flex', alignItems: 'center' }}><EscalatedIcon /> {messages.flagEsc}</div>);
        return { value: item.value, label };
      } return { value: '', label: '' };
    });
  }

  render() {
    const { classes, riskCategory, handleSubmit, reset } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSearch)}>
        <Grid item xs={12} className={classes.filterContainer} >
          <Grid container direction="row" >
            <Grid item sm={4} xs={12}>
              <SelectForm
                label={messages.labels.typeObservation}
                placeholder={messages.labels.choose}
                fieldName="category"
                values={this.styleFlags()}
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <SelectForm
                label={messages.labels.sector}
                placeholder={messages.labels.category}
                fieldName="type"
                values={riskCategory}
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <CheckboxForm
                label={messages.labels.show}
                fieldName="only_mine"
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

PartnerObservationsListFilter.propTypes = {
  /**
   *  reset function
   */
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  observationsType: PropTypes.array.isRequired,
  riskCategory: PropTypes.array.isRequired,
  pathName: PropTypes.string,
  query: PropTypes.object,
  agencyId: PropTypes.number,
};

const formFilter = reduxForm({
  form: 'partnerObservationsFilterForm',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(PartnerObservationsListFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { category } = {} } = ownProps.location;
  const { query: { type } = {} } = ownProps.location;
  const { query: { only_mine } = {} } = ownProps.location;

  return {
    observationsType: selectNormalizedFlagTypeChoices(state),
    riskCategory: selectNormalizedFlagCategoryChoices(state),
    pathName: ownProps.location.pathname,
    query: ownProps.location.query,
    initialValues: {
      category,
      type,
      only_mine,
    },
  };
};

const connected = connect(mapStateToProps)(formFilter);
const withRouterEoiFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'PartnerObservationsListFilter' })(withRouterEoiFilter));
