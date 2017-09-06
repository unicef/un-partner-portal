import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';

import { loadCfei } from '../../reducers/cfei';
import EoiFilter from './filters/eoiFilter';
import CfeiTableContainer from './cfeiTableContainer';

export const columnData = [
  { id: 'title', label: 'Project name' },
  { id: 'country_code', label: 'Country' },
  { id: 'sector', label: 'Sector' },
  { id: 'agency', label: 'Agency' },
  { id: 'deadline_date', label: 'Application deadline' },
  { id: 'start_date', label: 'Project start date' },
];

class CfeiContainer extends Component {
  componentWillMount() {
    this.props.loadCfei();
  }

  componentDidUpdate() {
    this.props.loadCfei();
  }

  render() {
    const { role, params: { type } } = this.props;
    return (
      <Grid container direction="column" gutter={40}>
        <Grid item>
          <EoiFilter />
        </Grid>
        <Grid item>
          <CfeiTableContainer role={role} type={type} />
        </Grid>
      </Grid>
    );
  }
}

CfeiContainer.propTypes = {
  role: PropTypes.string,
  params: PropTypes.object,
  loadCfei: PropTypes.func,
};

const mapStateToProps = state => ({
  role: state.session.role,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  const { type, ...params } = ownProps.params;
  return {
    loadCfei: () => dispatch(loadCfei(type, params)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CfeiContainer);
