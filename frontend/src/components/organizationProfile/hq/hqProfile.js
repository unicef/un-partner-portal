import React from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import PropTypes from 'prop-types';
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

