import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import HeaderOptionsContainer from './headerOptions/headerOptionsContainer';
import CustomTab from '../../common/customTab';
import HeaderNavigation from '../../common/headerNavigation';
import Loader from '../../common/loader';
import {
  selectCfeiDetailsItemsByType,
  selectCfeiTitle,
} from '../../../store';
import { loadCfei, loadUnsolicitedCfei } from '../../../reducers/cfeiDetails';
import { clearLocalState, projectApplicationExists } from '../../../reducers/conceptNote';
import CfeiDetailsHeaderProjectType from './cfeiDetailsHeaderProjectType';
import { ROLES, PROJECT_TYPES } from '../../../helpers/constants';
import PaddedContent from '../../common/paddedContent';
import MainContentWrapper from '../../common/mainContentWrapper';

const messages = {
  noCfei: 'Sorry but this project doesn\'t exist',
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

  componentWillMount() {
    const { role, type, loadCfeiDetails, loadProjectApplication, loadUCN } = this.props;
    if (role === ROLES.PARTNER) loadProjectApplication();
    if (type === PROJECT_TYPES.UNSOLICITED) loadUCN();
    else loadCfeiDetails();
  }

  componentWillUnmount() {
    this.props.uploadCnClearState();
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

  cfeiTabs() {
    return this.props.tabs.map((tab, index) => {
      if (index === 1) {
        return <CustomTab label={tab.label} key={index} checked={this.props.cnFile} />;
      }

      return <CustomTab label={tab.label} key={index} />;
    });
  }

  renderContent(index) {
    const {
      title,
      children,
      role,
      params: { type, id },
      error,
    } = this.props;
    if (error.notFound) {
      return (<MainContentWrapper>
        <Paper>
          <PaddedContent big >
            <Typography>{messages.noCfei}</Typography>
          </PaddedContent>
        </Paper>
      </MainContentWrapper>);
    } else if (error.message) {
      return (<MainContentWrapper>
        <Paper>
          <PaddedContent big >
            <Typography>{error.message}</Typography>
          </PaddedContent>
        </Paper>
      </MainContentWrapper>);
    }
    return (<HeaderNavigation
      index={index}
      titleObject={<CfeiDetailsHeaderProjectType type={type} title={title} />}
      customTabs={() => this.cfeiTabs()}
      header={<HeaderOptionsContainer role={role} type={type} id={id} />}
      handleChange={this.handleChange}
      backButton
      handleBackButton={this.handleBackButton}
    >
      {(index !== -1) && children}
    </HeaderNavigation>);
  }

  render() {
    const {
      loading,
    } = this.props;
    const index = this.updatePath();
    return (
      <Loader loading={loading}>
        {loading ? null : this.renderContent(index)}
      </Loader>
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
  loading: PropTypes.bool,
  loadCfeiDetails: PropTypes.func,
  loadProjectApplication: PropTypes.func,
  uploadCnClearState: PropTypes.func.isRequired,
  error: PropTypes.object,
  cnFile: PropTypes.bool,
  type: PropTypes.string,
  loadUCN: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  location: ownProps.location.pathname,
  tabs: selectCfeiDetailsItemsByType(state, ownProps.params.type),
  role: state.session.role,
  title: selectCfeiTitle(state, ownProps.params.id),
  type: ownProps.params.type,
  loading: state.cfeiDetails.status.loading,
  cnFile: state.conceptNote.cnFile,
  error: state.cfeiDetails.status.error,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  uploadCnClearState: () => dispatch(clearLocalState()),
  loadCfeiDetails: () => dispatch(loadCfei(ownProps.params.id)),
  loadProjectApplication: () => dispatch(projectApplicationExists(ownProps.params.id)),
  loadUCN: () => dispatch(loadUnsolicitedCfei(ownProps.params.id)),
});

const containerCfeiHeader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CfeiHeader);

export default containerCfeiHeader;
