import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import { loadCfei } from '../../reducers/cfei';
import EoiUnFilter from './filters/eoiUnFilter';
import EoiFilter from './filters/eoiFilter';
import EoiDsFilter from './filters/eoiDsFilter';
import CfeiTableContainer from './cfeiTableContainer';
import { isQueryChanged } from '../../helpers/apiHelper';

class CfeiContainer extends Component {
  componentWillMount() {
    const { query, loadCfei, params: { type } } = this.props;
    loadCfei(type, query);
  }

  shouldComponentUpdate(nextProps) {
    const { query, loadCfei, params: { type } } = this.props;
    if (isQueryChanged(nextProps, query)) {
      loadCfei(nextProps.params.type, nextProps.location.query);
      return false;
    } else if (type !== nextProps.params.type) {
      loadCfei(nextProps.params.type, nextProps.location.query);
    }
    return true;
  }

  render() {
    const { role, params: { type } } = this.props;

    return (
      <Grid container direction="column" spacing={40}>
        <Grid item>
          {type === 'open' && <EoiFilter />}
          {type === 'direct' && <EoiDsFilter />}
          {type === 'unsolicited' && <EoiUnFilter />}
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
  query: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  role: state.session.role,
  query: ownProps.location.query,
});

const mapDispatchToProps = dispatch => ({
  loadCfei: (type, query) => dispatch(loadCfei(type, query)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CfeiContainer);
