import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import { saveSelections } from '../../reducers/selectableListItems';
import HeaderNavigation from '../common/headerNavigation';
import resetChanges from '../eois/filters/eoiHelper';
import { checkPermission, AGENCY_PERMISSIONS } from '../../helpers/permissions';

const messages = {
  reports: 'Reports',
};

class ReportsHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.filterTabs = this.filterTabs.bind(this);
  }

  filterTabs() {
    const { tabs, hasCfeiPermission, hasVerificationPermission } = this.props;

    let filter = tabs;

    if (!hasCfeiPermission) {
      filter = R.reject(item => item.path === 'management', tabs);
    }

    if (!hasVerificationPermission) {
      filter = R.reject(item => item.path === 'verification', filter);
    }

    return filter;
  }

  updatePath() {
    const { location } = this.props;

    if (this.filterTabs().findIndex(tab => location.pathname.match(`^/reports/${tab.path}`)) === -1) {
      history.push('/');
    }

    return this.filterTabs().findIndex(tab => location.pathname.match(`^/reports/${tab.path}`));
  }

  handleChange(event, index) {
    const { query } = this.props;

    this.props.saveSelectedItems([]);

    history.push({
      pathname: `/reports/${this.filterTabs()[index].path}`,
      query: resetChanges(`/reports/${this.filterTabs()[index].path}`, query),
    });
  }

  render() {
    const {
      children,
    } = this.props;
    const index = this.updatePath();

    return (
      <HeaderNavigation
        index={index}
        title={messages.reports}
        tabs={this.filterTabs()}
        handleChange={this.handleChange}
      >
        {(index !== -1) && children}
      </HeaderNavigation>
    );
  }
}

ReportsHeader.propTypes = {
  tabs: PropTypes.array.isRequired,
  children: PropTypes.node,
  location: PropTypes.object,
  query: PropTypes.object,
  saveSelectedItems: PropTypes.func,
  hasCfeiPermission: PropTypes.bool,
  hasVerificationPermission: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  location: ownProps.location,
  tabs: state.reportsNav,
  query: ownProps.location.query,
  hasVerificationPermission: checkPermission(AGENCY_PERMISSIONS.RUN_REPORT_VERIFICATION_AND_FLAGGING, state),
  hasCfeiPermission: checkPermission(AGENCY_PERMISSIONS.RUN_REPORT_CFEI_MANAGEMENT, state),
});

const mapDispatch = dispatch => ({
  saveSelectedItems: items => dispatch(saveSelections(items)),
});

const containerCfeiHeader = connect(
  mapStateToProps,
  mapDispatch,
)(ReportsHeader);

export default containerCfeiHeader;
