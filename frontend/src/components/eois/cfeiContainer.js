import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import Card from 'material-ui';
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
import CustomGridColumn from '../common/grid/customGridColumn';

const { PARTNER, AGENCY } = ROLES;
const { OPEN, PINNED, DIRECT, UNSOLICITED } = PROJECT_TYPES;

class CfeiContainer extends Component {
  componentWillMount() {
    const { query, loadCfei, params: { type } } = this.props;

    loadCfei(type, query);
  }

  componentWillReceiveProps(nextProps) {
    const { query, loadCfei, params: { type } } = this.props;

    const typeChanged = type !== nextProps.params.type;
    const queryChanged = isQueryChanged(nextProps, query);

    if (typeChanged || queryChanged) {
      loadCfei(nextProps.params.type, nextProps.location.query);
    }

    if (typeChanged) {
      resetChanges(nextProps.location.pathname, query);
    }
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
      <CustomGridColumn>
        {this.filter()}
        <CfeiTableContainer role={role} type={type} />
      </CustomGridColumn>
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
