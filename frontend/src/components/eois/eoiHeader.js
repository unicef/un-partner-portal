import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';

import NewCfeiModalButton from './modals/newCfei/newCfeiModalButton';
import HeaderNavigation from '../common/headerNavigation';
import { checkPermission, COMMON_PERMISSIONS } from '../../helpers/permissions';
import PermissionNotification from '../common/permissionNotification';


class EoiHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  updatePath() {
    const { tabs, params: { type } } = this.props;
    const index = tabs.findIndex(itab => itab.path === type);
    if (index === -1) {
      // TODO: do real 404
      history.push('/');
    }
    return index;
  }

  handleChange(event, index) {
    const { tabs, location } = this.props;
    history.push({
      pathname: `/cfei/${tabs[index].path}`,
      query: location.query,
    });
  }

  render() {
    const {
      hasPermission,
      tabs,
      children,
      role,
      params: { type, id },
    } = this.props;
    const index = this.updatePath();
    if (hasPermission) {
      return (
        <HeaderNavigation
          index={index}
          title={'Partnership Opportunities'}
          tabs={tabs}
          header={(!id && type && type !== 'unsolicited' && role === 'agency')
           && <NewCfeiModalButton type={type} />}
          handleChange={this.handleChange}
        >
          {(index !== -1) && children}
        </HeaderNavigation>
      );
    }

    return <PermissionNotification />;
  }
}

EoiHeader.propTypes = {
  tabs: PropTypes.array.isRequired,
  children: PropTypes.node,
  role: PropTypes.string,
  params: PropTypes.object,
  location: PropTypes.object,
  hasPermission: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  location: ownProps.location,
  tabs: state.cfeiNav,
  role: state.session.role,
  hasPermission: checkPermission(COMMON_PERMISSIONS.CFEI_VIEW, state),
});

const containerCfeiHeader = connect(
  mapStateToProps,
)(EoiHeader);

export default containerCfeiHeader;
