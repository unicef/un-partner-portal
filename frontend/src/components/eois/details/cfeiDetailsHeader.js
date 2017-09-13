import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import HeaderOptionsContainer from './headerOptions/headerOptionsContainer';
import HeaderNavigation from '../../common/headerNavigation';
import {
  selectCfeiDetailsItemsByType,
  selectCfeiTitle,
} from '../../../store';

const messages = {
  noCfei: 'Sorry but this cfei doesn\'t exist',
};

class CfeiHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  updatePath() {
    const { tabs, params: { type, id }, location } = this.props;
    const tabIndex = tabs.findIndex(tab => location.match(`^/cfei/${type}/${id}/${tab.path}`));
    if (tabIndex === -1) {
      // TODO: do real 404
      history.push('/');
    }
    return tabIndex;
  }

  handleChange(event, index) {
    const { tabs, params: { type, id } } = this.props;
    history.push(`/cfei/${type}/${id}/${tabs[index].path}`);
  }

  handleBackButton() {
    const { params: { type } } = this.props;
    history.push(`/cfei/${type}`);
  }

  render() {
    const {
      title,
      tabs,
      children,
      role,
      params: { type },
    } = this.props;
    const index = this.updatePath();
    return (
      <Grid item>
        {title
          ? <HeaderNavigation
            index={index}
            title={title}
            tabs={tabs}
            header={<HeaderOptionsContainer role={role} type={type} />}
            handleChange={this.handleChange}
            backButton
            handleBackButton={this.handleBackButton}
          >
            {(index !== -1) && children}
          </HeaderNavigation>
          : <Typography >{messages.noCfei}</Typography>
        }
      </Grid>
    );
  }
}

CfeiHeader.propTypes = {
  title: PropTypes.string,
  tabs: PropTypes.array.isRequired,
  children: PropTypes.node,
  role: PropTypes.string,
  params: PropTypes.object,
  location: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  location: ownProps.location.pathname,
  tabs: selectCfeiDetailsItemsByType(state, ownProps.params.type),
  role: state.session.role,
  title: selectCfeiTitle(state, ownProps.params.id),
});

const containerCfeiHeader = connect(
  mapStateToProps,
)(CfeiHeader);

export default containerCfeiHeader;
