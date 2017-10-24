import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import {
  selectMostRecentVerification,
  selectPreviousVerificationCount,
  selectPartnerVerifications,
} from '../../../../../store';
import VerificationItem from './verificationItem';

import Loader from '../../../../common/loader';
import EmptyContent from '../../../../common/emptyContent';
import SimpleCollapsableItem from '../../../../common/simpleCollapsableItem';
import PreviousVerificationsList from './previousVerificationsList';
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
  }

  render() {
    const { mostRecentVerification, loading, previousCount, verifications } = this.props;
    if (loading) return <Loader loading={loading}><EmptyContent /></Loader>;
    return (
      <div>
        <PaddedContent>
          <VerificationItem verification={mostRecentVerification} />
        </PaddedContent>
        {previousCount && <SimpleCollapsableItem
          title={<Typography type="caption">{`${messages.previous}: ${previousCount}`}</Typography>}
          component={<PreviousVerificationsList verifications={verifications} />}
        />}
      </div>
    );
  }
}

VerificationContent.propTypes = {
  mostRecentVerification: PropTypes.object,
  loading: PropTypes.bool,
  previousCount: PropTypes.number,
  verifications: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => ({
  mostRecentVerification: selectMostRecentVerification(state, ownProps.partnerId),
  previousCount: selectPreviousVerificationCount(state, ownProps.partnerId),
  verifications: selectPartnerVerifications(state, ownProps.partnerId),
  loading: state.partnerVerifications.status.loading,
});

export default connect(mapStateToProps)(VerificationContent);
