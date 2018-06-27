import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import HeaderOptionsContainer from './headerOptions/headerOptionsContainer';
import CustomTab from '../../common/customTab';
import HeaderNavigation from '../../common/headerNavigation';
import Loader from '../../common/loader';
import {
  selectCfeiDetailsItemsByType,
  selectCfeiTitle,
  selectCfeiStatus,
  isUserAReviewer,
  isUserACreator,
  isUserAFocalPoint,
} from '../../../store';
import { loadCfei, loadUnsolicitedCfei, isCfeiCompleted } from '../../../reducers/cfeiDetails';
import { clearLocalState, projectApplicationExists } from '../../../reducers/conceptNote';
import CfeiDetailsHeaderProjectType from './cfeiDetailsHeaderProjectType';
import { ROLES, PROJECT_TYPES, DETAILS_ITEMS } from '../../../helpers/constants';
import PaddedContent from '../../common/paddedContent';
import MainContentWrapper from '../../common/mainContentWrapper';
import { isUserAgencyReader, isUserAgencyEditor } from '../../../helpers/authHelpers';
import { checkPermission, isRoleOffice, AGENCY_ROLES, PARTNER_PERMISSIONS, AGENCY_PERMISSIONS } from '../../../helpers/permissions';
import { Agent } from 'https';

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
    this.cfeiTabs = this.cfeiTabs.bind(this);
    this.filterTaba = this.filterTabs.bind(this);
    this.hasPermissionToViewApplications = this.hasPermissionToViewApplications.bind(this);
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
  hasPermissionToViewApplications(hasActionPermission) {
    const { isAdvEd, isPAM, isBasEd, isMFT, isCreator, isFocalPoint } = this.props;

    return ((hasActionPermission && isAdvEd && (isCreator || isFocalPoint))
    || (hasActionPermission && isBasEd && isCreator)
    || (hasActionPermission && isMFT && isFocalPoint)
    || (hasActionPermission && isPAM && isCreator));
  }

  updatePath() {
    const { params: { type, id }, location } = this.props;
    const tabsToRender = this.filterTabs();
    const tabIndex = tabsToRender.findIndex(tab => location.match(`^/cfei/${type}/${id}/${tab.path}`));
    if (tabIndex === -1) {
      // TODO: do real 404
      history.push('/');
    }
    return tabIndex;
  }

  handleChange(event, index) {
    const { params: { type, id } } = this.props;
    const tabsToRender = this.filterTabs();
    history.push(`/cfei/${type}/${id}/${tabsToRender[index].path}`);
  }

  filterTabs() {
    const { tabs,
      role,
      isCompleted,
      hasUploadCnPermission,
      hasViewAllPermission,
      hasViewWinnerPermission,
      hasViewApplicationsPermission,
      params: { type } } = this.props;

    let tabsToRender = [];

    if (role === ROLES.PARTNER) {
      tabsToRender = hasUploadCnPermission
        ? tabs
        : R.filter(item => ((item.path) !== (DETAILS_ITEMS.SUBMISSION)), tabs);
    } else if (role === ROLES.AGENCY && type === PROJECT_TYPES.OPEN && !isCompleted) {
      tabsToRender = this.hasPermissionToViewApplications(hasViewApplicationsPermission)
        ? tabs
        : R.filter(item => ((item.path) !== (DETAILS_ITEMS.APPLICATIONS)
         && (item.path) !== (DETAILS_ITEMS.PRESELECTED)), tabs);
    } else if (role === ROLES.AGENCY && type === PROJECT_TYPES.OPEN && isCompleted) {
      tabsToRender = this.hasPermissionToViewApplications(hasViewApplicationsPermission)
        ? tabs
        : R.filter(item => ((item.path) !== (DETAILS_ITEMS.APPLICATIONS)
         && (item.path) !== (DETAILS_ITEMS.PRESELECTED)), tabs);

      tabsToRender = (hasViewAllPermission || hasViewWinnerPermission)
        ? tabsToRender
        : R.filter(item => ((item.path) !== (DETAILS_ITEMS.RESULTS)
         && (item.path) !== (DETAILS_ITEMS.PRESELECTED)), tabsToRender);
    }

    return tabsToRender;
  }

  cfeiTabs() {
    const { cnFile } = this.props;
    const tabsToRender = this.filterTabs();
    return tabsToRender.map((tab, index) => {
      if (index === 1) {
        return <CustomTab label={tab.label} key={index} checked={!!cnFile} />;
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
      defaultReturn="/cfei/open"
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
  cnFile: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  type: PropTypes.string,
  hasUploadCnPermission: PropTypes.bool.isRequired,
  hasViewApplicationsPermission: PropTypes.bool.isRequired,
  hasViewAllPermission: PropTypes.bool.isRequired,
  loadUCN: PropTypes.func,
  isFocalPoint: PropTypes.bool,
  isCreator: PropTypes.bool,
  isAdvEd: PropTypes.bool,
  isMFT: PropTypes.bool,
  isPAM: PropTypes.bool,
  isBasEd: PropTypes.bool,
  isCompleted: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  location: ownProps.location.pathname,
  tabs: selectCfeiDetailsItemsByType(state, ownProps.params.type),
  role: state.session.role,
  title: selectCfeiTitle(state, ownProps.params.id),
  type: ownProps.params.type,
  loading: state.cfeiDetails.status.loading,
  hasUploadCnPermission: checkPermission(PARTNER_PERMISSIONS.CFEI_SUBMIT_CONCEPT_NOTE, state),
  hasViewApplicationsPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_VIEW_APPLICATIONS, state),
  hasViewAllPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_FINALIZED_VIEW_ALL_INFO, state),
  hasViewWinnerPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_FINALIZED_VIEW_WINNER_AND_CN, state),
  cnFile: state.conceptNote.cnFile,
  error: state.cfeiDetails.status.error,
  isReaderEditor: isUserAgencyReader(state) || isUserAgencyEditor(state),
  status: selectCfeiStatus(state, ownProps.params.id),
  isReviewer: isUserAReviewer(state, ownProps.params.id),
  isCreator: isUserACreator(state, ownProps.params.id),
  isFocalPoint: isUserAFocalPoint(state, ownProps.params.id),
  isAdvEd: isRoleOffice(AGENCY_ROLES.EDITOR_ADVANCED, state),
  isMFT: isRoleOffice(AGENCY_ROLES.MFT_USER, state),
  isPAM: isRoleOffice(AGENCY_ROLES.PAM_USER, state),
  isBasEd: isRoleOffice(AGENCY_ROLES.EDITOR_BASIC, state),
  isCompleted: isCfeiCompleted(state, ownProps.params.id),
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
