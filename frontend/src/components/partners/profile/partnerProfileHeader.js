import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import PartnerProfileHeaderMenu from './partnerProfileHeaderMenu';
import HeaderNavigation from '../../../components/common/headerNavigation';
import {
  loadPartnerProfileSummary,
} from '../../../reducers/agencyPartnerProfile';
import {
  loadPartnerVerifications,
} from '../../../reducers/partnerVerifications';
import VerificationIcon from '../profile/icons/verificationIcon';
import FlaggingStatus from '../profile/common/flaggingStatus';
import { checkPermission, AGENCY_PERMISSIONS } from '../../../helpers/permissions';

const messages = {
  observationTab: 'observations',
  verificationTab: 'verification',
};

const PartnerTitle = (props) => {
  const {
    partner: {
      name = '',
      partnerStatus: { is_verified, flagging_status: flags = {},
      } = {},
    } = {},
  } = props;
  return (
    <Grid container alignItems="center">
      <Grid item>
        <Typography type="headline">
          {name}
        </Typography>
      </Grid>
      <Grid item>
        <VerificationIcon verified={is_verified} />
      </Grid>
      <Grid item>
        <FlaggingStatus flags={flags} />
      </Grid>
    </Grid>);
};

class PartnerProfileHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.props.loadPartnerSummary();
    this.props.loadPartnerVerifications();
  }

  updatePath() {
    const { tabs, location, partnerId, hasViewObservationPermission, hasVerifySeeCommentsPermission } = this.props;

    let filterTabs = (hasViewObservationPermission)
      ? tabs
      : R.filter(item => item.path !== messages.observationTab, tabs);

    filterTabs = (hasVerifySeeCommentsPermission)
      ? filterTabs
      : R.filter(item => item.path !== messages.verificationTab, filterTabs);

    if (filterTabs.findIndex(tab => location.match(`^/partner/${partnerId}/${tab.path}`)) === -1) {
      history.push('/');
    }

    return filterTabs.findIndex(tab => location.match(`^/partner/${partnerId}/${tab.path}`));
  }

  handleChange(event, index) {
    const { tabs, partnerId, hasViewObservationPermission, hasVerifySeeCommentsPermission } = this.props;

    let filterTabs = (hasViewObservationPermission)
      ? tabs
      : R.filter(item => item.path !== messages.observationTab, tabs);

    filterTabs = (hasVerifySeeCommentsPermission)
      ? filterTabs
      : R.filter(item => item.path !== messages.verificationTab, filterTabs);

    history.push(`/partner/${partnerId}/${filterTabs[index].path}`);
  }

  render() {
    const {
      tabs,
      children,
      hasViewObservationPermission,
      hasVerifySeeCommentsPermission,
    } = this.props;
    
    let filterTabs = (hasViewObservationPermission)
      ? tabs
      : R.filter(item => item.path !== messages.observationTab, tabs);

    filterTabs = (hasVerifySeeCommentsPermission)
      ? filterTabs
      : R.filter(item => item.path !== messages.verificationTab, filterTabs);

    const index = this.updatePath();
    return (
      <div>
        <HeaderNavigation
          backButton
          tabs={filterTabs}
          index={index}
          defaultReturn="/partner"
          header={<PartnerProfileHeaderMenu handleMoreClick={() => { }} />}
          titleObject={PartnerTitle(this.props)}
          handleChange={this.handleChange}
        >
          {children}
        </HeaderNavigation>
      </div>
    );
  }
}

PartnerProfileHeader.propTypes = {
  tabs: PropTypes.array.isRequired,
  children: PropTypes.node,
  hasVerifySeeCommentsPermission: PropTypes.bool,
  hasViewObservationPermission: PropTypes.bool,
  location: PropTypes.string.isRequired,
  partnerId: PropTypes.string.isRequired,
  loadPartnerSummary: PropTypes.func,
  loadPartnerVerifications: PropTypes.func,
};

PartnerTitle.propTypes = {
  partner: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  tabs: state.agencyPartnerProfileNav.tabs,
  partner: state.agencyPartnerProfile.data[ownProps.params.id] || {},
  partnerId: ownProps.params.id,
  location: ownProps.location.pathname,
  hasViewObservationPermission:
    checkPermission(AGENCY_PERMISSIONS.VIEW_PROFILE_OBSERVATION_FLAG_COMMENTS, state),
  hasVerifySeeCommentsPermission: checkPermission(AGENCY_PERMISSIONS.VERIFY_SEE_COMMENTS, state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onItemClick: (id, path) => {
    history.push(path);
  },
  loadPartnerSummary: () => dispatch(loadPartnerProfileSummary(ownProps.params.id)),
  loadPartnerVerifications: () => dispatch(
    loadPartnerVerifications(ownProps.params.id, { page_size: 5, page: 1 })),
});

const connectedPartnerProfile = connect(mapStateToProps, mapDispatchToProps)(PartnerProfileHeader);

export default connectedPartnerProfile;
