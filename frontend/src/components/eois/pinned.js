// eslint-disable-next-line
import React from 'react';
import { connect } from 'react-redux';


import { loadPinnedCfei } from '../../reducers/cfei';

import EoiPartnerTable from './eoiPartnerTable';


class Pinned extends EoiPartnerTable {
  componentWillMount() {
    loadPinnedCfei(this.props.dispatch);
  }
}

export default connect(
  (state) => {
    const cfeiState = state.cfei;
    return {
      cfei: cfeiState.cfei,
      loading: cfeiState.loading,
      errorMsg: cfeiState.error.message,
    };
  },
)(Pinned);
