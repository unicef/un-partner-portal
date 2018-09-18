import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { withStyles } from 'material-ui/styles';
import { browserHistory as history, withRouter } from 'react-router';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import SelectForm from '../../../components/forms/selectForm';
import TextFieldForm from '../../../components/forms/textFieldForm';
import resetChanges from '../../../components/eois/filters/eoiHelper';
import { selectNormalizedRoleChoices, selectNormalizedOffices } from '../../../store';

const messages = {
  choose: 'Choose',
  labels: {
    search: 'Search',
    office: 'Office',
    role: 'Role',
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

class UsersFilter extends Component {
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

    const { role, name, office } = values;

    history.push({
      pathname: pathName,
      query: R.merge(query, {
        page: 1,
        role,
        name,
        office,
      }),
    });
  }

  render() {
    const { classes, handleSubmit, roleChoices, offices, reset } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Grid item xs={12} className={classes.filterContainer} >
          <Grid container direction="row" >
            <Grid item sm={4} xs={12} >
              <TextFieldForm
                label={messages.labels.search}
                placeholder={messages.labels.search}
                fieldName="name"
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <SelectForm
                fieldName={'office'}
                label={messages.labels.office}
                values={offices}
                optional
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <SelectForm
                fieldName={'role'}
                label={messages.labels.role}
                values={roleChoices}
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

UsersFilter.propTypes = {
  /**
   *  reset function
   */
  reset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  pathName: PropTypes.string,
  roleChoices: PropTypes.array,
  offices: PropTypes.array,
  query: PropTypes.object,
};

const formUsersFilter = reduxForm({
  form: 'tableFilter',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(UsersFilter);

const mapStateToProps = (state, ownProps) => {
  const { query: { name } = {} } = ownProps.location;
  const { query: { role } = {} } = ownProps.location;
  const { query: { office } = {} } = ownProps.location;
  const officeQ = office && Number(office);

  return {
    pathName: ownProps.location.pathname,
    roleChoices: selectNormalizedRoleChoices(state),
    offices: selectNormalizedOffices(state),
    query: ownProps.location.query,
    initialValues: {
      name,
      role,
      office: officeQ },
  };
};

const connected = connect(mapStateToProps, null)(formUsersFilter);
const withRouterFilter = withRouter(connected);

export default (withStyles(styleSheet, { name: 'UsersFilter' })(withRouterFilter));
