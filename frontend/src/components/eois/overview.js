// eslint-disable-next-line
import React from 'react';
import { connect } from 'react-redux';

import { loadOpenCfei } from '../../reducers/cfei';
import EoiPartnerTable from './eoiPartnerTable';

class Overview extends EoiPartnerTable {
  componentWillMount() {
    loadOpenCfei(this.props.dispatch);
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
)(Overview);
