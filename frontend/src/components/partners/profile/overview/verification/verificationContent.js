import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';
import { browserHistory as history } from 'react-router';
import { connect } from 'react-redux';
import {
  selectMostRecentVerification,
  selectPreviousVerificationCount,
  selectPartnerVerifications,
} from '../../../../../store';
import VerificationItem from './verificationItem';
import Warning from 'material-ui-icons/Warning';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Loader from '../../../../common/loader';
import EmptyContent from '../../../../common/emptyContent';
import PaddedContent from '../../../../common/paddedContent';
import { withStyles } from 'material-ui/styles';
import { loadPartnerProfileSummary } from '../../../../../reducers/agencyPartnerProfile';

const messages = {
  verification: 'Verification can\'t be done, \n because HQ Profile is not verified.',
  verifyHq: 'verify hq profile',
};

const styleSheet = () => {
  return {
    container: {
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      display: 'flex',
      marginLeft: 'auto',
      marginTop: 10,
    },
    icon: {
      fill: '#FF0000',
      width: 30,
      marginRight: 10,
      height: 30,
    },
  };
};

class VerificationContent extends Component {
  constructor() {
    super();

    this.hqNotVerified = this.hqNotVerified.bind(this);
  }

  hqNotVerified() {
    const { classes, partner, loadPartnerProfile } = this.props;

    return <PaddedContent>
      <div className={classes.container}>
        <Warning className={classes.icon} />
        <Typography type="body2">{messages.verification}</Typography>
      </div>
      <Button
        className={classes.button}
        onTouchTap={() => {
          loadPartnerProfile(partner.hq.id);
          history.push(`/partner/${partner.hq.id}/overview`);
        }}
        color="accent"
      >
        {messages.verifyHq}
      </Button>
    </PaddedContent >
  }

  render() {
    const { mostRecentVerification, loading, verifications, partner } = this.props;

    if (loading && isEmpty(verifications)) {
      return <Loader loading={loading}><EmptyContent /></Loader>;
    } else if (partner && partner.hq && partner.hq.partner_additional && !partner.hq.partner_additional.is_verified) {
      return this.hqNotVerified();
    }

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
  classes: PropTypes.object.isRequired,
  mostRecentVerification: PropTypes.object,
  loading: PropTypes.bool,
  previousCount: PropTypes.number,
  verifications: PropTypes.array,
  partnerId: PropTypes.string,
  partner: PropTypes.object,
  loadPartnerProfile: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  mostRecentVerification: selectMostRecentVerification(state, ownProps.partnerId),
  previousCount: selectPreviousVerificationCount(state, ownProps.partnerId),
  verifications: selectPartnerVerifications(state, ownProps.partnerId),
  loading: state.partnerVerifications.status.loading,
  partner: state.agencyPartnerProfile.data[ownProps.partnerId] || {},
});

const mapDispatchToProps = (dispatch) => ({
  loadPartnerProfile: partner => dispatch(loadPartnerProfileSummary(partner)),
});

const connected = connect(mapStateToProps, mapDispatchToProps)(VerificationContent);

export default withStyles(styleSheet, { name: 'VerificationContent' })(connected);

