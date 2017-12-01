import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import { loadCfei } from '../../reducers/cfei';
import EoiUnFilter from './filters/eoiUnFilter';
import EoiFilter from './filters/eoiFilter';
import EoiPinnedFilter from './filters/eoiPinnedFilter';
import EoiPartnerFilter from './filters/eoiPartnerFilter';
import EoiDsFilter from './filters/eoiDsFilter';
import CfeiTableContainer from './cfeiTableContainer';
import { isQueryChanged } from '../../helpers/apiHelper';
import { PROJECT_TYPES, ROLES } from '../../helpers/constants';
import resetChanges from './filters/eoiHelper';

const { PARTNER, AGENCY } = ROLES;
const { OPEN, PINNED, DIRECT, UNSOLICITED } = PROJECT_TYPES;

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
      resetChanges(nextProps.location.pathname, query);
    }
    return true;
  }

  filter() {
    const { role, params: { type } } = this.props;

    if (role === PARTNER) {
      if (type === OPEN) {
        return <EoiPartnerFilter />;
      } else if (type === PINNED) {
        return <EoiPinnedFilter />;
      }
    } else if (role === AGENCY) {
      if (type === OPEN) {
        return <EoiFilter />;
      } else if (type === DIRECT) {
        return <EoiDsFilter />;
      } else if (type === UNSOLICITED) {
        return <EoiUnFilter />;
      }
    }

    return null;
  }

  render() {
    const { role, params: { type } } = this.props;

    return (
      <Grid container direction="column" spacing={24}>
        <Grid item>
          {this.filter()}
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
