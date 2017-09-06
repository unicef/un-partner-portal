import React from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import PropTypes from 'prop-types';
import HqProfileOverviewHeader from './hqProfileOverviewHeader';
import HeaderNavigation from '../../../components/common/headerNavigation';

const messages = {
  header: 'HQ Profile',
};

const HqProfile = (props) => {
  const { tabs, children } = props;
  return (
    <div>
      <HeaderNavigation
        backButton
        tabs={tabs}
        children={children}
        handleBackButton={() => { history.goBack(); }}
        header={<HqProfileOverviewHeader update="12 Aug 2017" handleEditClick={() => { history.push('profile/edit'); }} />}
        title={messages.header}
      />
    </div>
  );
};

HqProfile.propTypes = {
  tabs: PropTypes.array.isRequired,
  children: PropTypes.node,
};

const mapStateToProps = state => ({
  tabs: state.hqProfileNav,
});

const mapDispatchToProps = () => ({
  onItemClick: (id, path) => {
    history.push(path);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HqProfile);

