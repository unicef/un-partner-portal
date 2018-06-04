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
import { loadCfei, loadUnsolicitedCfei } from '../../../reducers/cfeiDetails';
import { clearLocalState, projectApplicationExists } from '../../../reducers/conceptNote';
import CfeiDetailsHeaderProjectType from './cfeiDetailsHeaderProjectType';
import { ROLES, PROJECT_TYPES, PROJECT_STATUSES, DETAILS_ITEMS } from '../../../helpers/constants';
import PaddedContent from '../../common/paddedContent';
import MainContentWrapper from '../../common/mainContentWrapper';
import { isUserAgencyReader, isUserAgencyEditor } from '../../../helpers/authHelpers';
import { checkPermission, PARTNER_PERMISSIONS } from '../../../helpers/permissions';

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
      isOwner,
      isReaderEditor,
      status,
      hasPermission,
      isReviewer, params: { type } } = this.props;

    let tabsToRender = hasPermission
      ? tabs
      : R.filter(item => ((item.path) !== (DETAILS_ITEMS.SUBMISSION)), tabs);


    if (role === ROLES.AGENCY && type === PROJECT_TYPES.OPEN) {
      tabsToRender = tabsToRender.filter(({ path }) => {
        if ((['applications', 'preselected'].includes(path) && isReaderEditor && !isReviewer && !isOwner)
        || (path === 'results' && isReaderEditor && status !== PROJECT_STATUSES.COM && !isReviewer && !isOwner)) {
          return false;
        }
        return true;
      });
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
  hasPermission: PropTypes.bool.isRequired,
  loadUCN: PropTypes.func,
  isReaderEditor: PropTypes.bool,
  isReviewer: PropTypes.bool,
  status: PropTypes.string,
  isOwner: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  location: ownProps.location.pathname,
  tabs: selectCfeiDetailsItemsByType(state, ownProps.params.type),
  role: state.session.role,
  title: selectCfeiTitle(state, ownProps.params.id),
  type: ownProps.params.type,
  loading: state.cfeiDetails.status.loading,
  hasPermission: checkPermission(PARTNER_PERMISSIONS.CFEI_SUBMIT_CONCEPT_NOTE, state),
  cnFile: state.conceptNote.cnFile,
  error: state.cfeiDetails.status.error,
  isReaderEditor: isUserAgencyReader(state) || isUserAgencyEditor(state),
  status: selectCfeiStatus(state, ownProps.params.id),
  isReviewer: isUserAReviewer(state, ownProps.params.id),
  isOwner: isUserACreator(state, ownProps.params.id)
    || isUserAFocalPoint(state, ownProps.params.id),
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
