import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../../common/list/headerList';
import VerificationContent from './verificationContent';

const messages = {
  verificationStatus: 'Verification status',
};

const fields = partnerId => (
  <VerificationContent partnerId={partnerId} />
);

const summaryHeader = () => (<Typography style={{ margin: 'auto 0' }} type="title">{messages.verificationStatus}</Typography>);

const PartnerOverviewVerification = (props) => {
  const { partnerId } = props;
  return (
    <div>
      <HeaderList
        header={summaryHeader()}
      >
        {fields(partnerId)}
      </HeaderList>
    </div>);
};

PartnerOverviewVerification.propTypes = {

};

const mapStateToProps = (state, ownProps) => ({

});

export default connect(mapStateToProps)(PartnerOverviewVerification);
