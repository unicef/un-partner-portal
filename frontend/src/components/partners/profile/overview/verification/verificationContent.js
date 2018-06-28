import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';
import { connect } from 'react-redux';
import {
  selectMostRecentVerification,
  selectPreviousVerificationCount,
  selectPartnerVerifications,
} from '../../../../../store';
import VerificationItem from './verificationItem';

import Loader from '../../../../common/loader';
import EmptyContent from '../../../../common/emptyContent';
import PaddedContent from '../../../../common/paddedContent';

const messages = {
  previous: 'Number of previous status changes',
};

class VerificationContent extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { mostRecentVerification, loading, previousCount, verifications, partnerId } = this.props;
    if (loading && isEmpty(verifications)) return <Loader loading={loading}><EmptyContent /></Loader>;

    return (
      <Loader loading={loading}>
        <div>
          <PaddedContent>
            <VerificationItem verification={mostRecentVerification} />
          </PaddedContent>
        </div>
      </Loader>
    );
  }
}

VerificationContent.propTypes = {
  mostRecentVerification: PropTypes.object,
  loading: PropTypes.bool,
  previousCount: PropTypes.number,
  verifications: PropTypes.array,
  partnerId: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  mostRecentVerification: selectMostRecentVerification(state, ownProps.partnerId),
  previousCount: selectPreviousVerificationCount(state, ownProps.partnerId),
  verifications: selectPartnerVerifications(state, ownProps.partnerId),
  loading: state.partnerVerifications.status.loading,
});

export default connect(mapStateToProps)(VerificationContent);
