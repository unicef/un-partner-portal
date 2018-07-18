import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import { saveSelections } from '../../reducers/selectableListItems';
import HeaderNavigation from '../common/headerNavigation';
import resetChanges from '../eois/filters/eoiHelper';

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
  }

  updatePath() {
    const { tabs, location } = this.props;

    if (tabs.findIndex(tab => location.pathname.match(`^/reports/${tab.path}`)) === -1) {
      history.push('/');
    }

    return tabs.findIndex(tab => location.pathname.match(`^/reports/${tab.path}`));
  }

  handleChange(event, index) {
    const { tabs, query } = this.props;
    this.props.saveSelectedItems([]);
    history.push({
      pathname: `/reports/${tabs[index].path}`,
      query: resetChanges(`/reports/${tabs[index].path}`, query),
    });
  }

  render() {
    const {
      tabs,
      children,
    } = this.props;
    const index = this.updatePath();

    return (
      <HeaderNavigation
        index={index}
        title={messages.reports}
        tabs={tabs}
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
};

const mapStateToProps = (state, ownProps) => ({
  location: ownProps.location,
  tabs: state.reportsNav,
  query: ownProps.location.query,
});

const mapDispatch = dispatch => ({
  saveSelectedItems: items => dispatch(saveSelections(items)),
});

const containerCfeiHeader = connect(
  mapStateToProps,
  mapDispatch,
)(ReportsHeader);

export default containerCfeiHeader;
