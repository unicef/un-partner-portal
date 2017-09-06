import React from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import PropTypes from 'prop-types';
import PartnerProfileHeader from './partnerProfileHeader';
import HeaderNavigation from '../../../components/common/headerNavigation';

const messages = {
  header: 'HQ Profile',
};

const PartnerProfile = (props) => {
  const { tabs, children } = props;
  return (
    <div>
      <HeaderNavigation
        backButton
        tabs={tabs}
        children={children}
        handleBackButton={() => { history.goBack(); }}
        header={<PartnerProfileHeader handleMoreClick={() => { }} />}
        title={messages.header}
      />
    </div>
  );
};

PartnerProfile.propTypes = {
  tabs: PropTypes.array.isRequired,
  children: PropTypes.node,
};

const mapStateToProps = state => ({
  tabs: state.agencyPartnerProfile.tabs,
  partner: state.agencyPartnerProfile.partner,
});

const mapDispatchToProps = () => ({
  onItemClick: (id, path) => {
    history.push(path);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PartnerProfile);

