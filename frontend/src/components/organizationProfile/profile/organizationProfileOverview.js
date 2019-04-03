import R from 'ramda';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';
import CollapsableItem from '../../../components/common/collapsableItem';
import PartnerProfileCollaboration from '../edit/collaboration/partnerProfileCollaboration';
import PartnerProfileIdentification from '../edit/identification/partnerProfileIdentification';
import PartnerProfileContactInfo from '../edit/contactInformation/partnerProfileContactInfo';
import PartnerProfileMandate from '../edit/mandate/partnerProfileMandate';
import PartnerProfileFunding from '../edit/funding/partnerProfileFunding';
import PartnerProfileProjectImplementation from '../edit/projectImplementation/partnerProfileProjectImplementation';
import PartnerProfileOtherInfo from '../edit/otherInfo/partnerProfileOtherInfo';
import { loadPartnerDetails } from '../../../reducers/partnerProfileDetails';
import { changeTab } from '../../../reducers/partnerProfileEdit';
import { checkPermission, PARTNER_PERMISSIONS } from '../../../helpers/permissions';
import Loader from '../../../components/common/loader';

const FIRST_INDEX = 0;

const completionTabs = [
  'identification_is_complete',
  'contact_is_complete',
  'mandatemission_complete',
  'funding_complete',
  'collaboration_complete',
  'proj_impl_is_complete',
  'other_info_is_complete',
];

const messages = {
  sections: [
    { label: 'Identification' },
    { label: 'Contact information' },
    { label: 'Mandate & Mission' },
    { label: 'Funding' },
    { label: 'Collaboration' },
    { label: 'Project Implementation' },
    { label: 'Other Information' },
  ],
  sectionComponents: [
    <PartnerProfileIdentification readOnly />,
    <PartnerProfileContactInfo readOnly />,
    <PartnerProfileMandate readOnly />,
    <PartnerProfileFunding readOnly />,
    <PartnerProfileCollaboration readOnly />,
    <PartnerProfileProjectImplementation readOnly />,
    <PartnerProfileOtherInfo readOnly />,
  ],
};

class OrganizationProfileOverview extends Component {
  componentWillMount() {
    const { partnerId } = this.props;

    this.props.loadPartnerProfileDetails(partnerId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.partnerId !== this.props.partnerId) {
      this.props.loadPartnerProfileDetails(nextProps.partnerId);
    }
  }

  handleEditMode(sectionIndex) {
    const { partnerId } = this.props;

    this.props.changeTab(sectionIndex);
    history.push(`/profile/${partnerId}/edit`);
  }


  render() {
    const { completion, partnerLoading, hq, hasEditHqProfilePermission, hasEditProfilePermission } = this.props;

    return (
      <React.Fragment>
        {messages.sections.map(item =>
          (<div key={item.label}>
            <CollapsableItem
              expanded={R.indexOf(item, messages.sections) === FIRST_INDEX}
              title={item.label}
              warning={completion
                ? completion[completionTabs[R.indexOf(item, messages.sections)]]
                : false}
              handleEditMode={((!hq && hasEditHqProfilePermission)
                 || (hq && hasEditProfilePermission))
                ? () => this.handleEditMode(R.indexOf(item, messages.sections))
                : false
              }
              component={messages.sectionComponents[R.indexOf(item, messages.sections)]}
            />
            <Divider />
          </div>
          ))
        }
        <Loader loading={partnerLoading} fullscreen />
      </React.Fragment>
    );
  }
}

OrganizationProfileOverview.propTypes = {
  changeTab: PropTypes.func.isRequired,
  partnerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  loadPartnerProfileDetails: PropTypes.func,
  completion: PropTypes.object,
  hq: PropTypes.number,
  hasEditHqProfilePermission: PropTypes.bool,
  hasEditProfilePermission: PropTypes.bool,
  partnerLoading: PropTypes.bool,
};

const mapDispatch = dispatch => ({
  changeTab: index => dispatch(changeTab(index)),
  loadPartnerProfileDetails: partnerId => dispatch(loadPartnerDetails(partnerId)),
});

const mapStateToProps = state => ({
  partnerLoading: state.partnerProfileDetails.detailsStatus.loading,
  completion: state.partnerProfileDetails.partnerProfileDetails.completion,
  hasEditProfilePermission: checkPermission(PARTNER_PERMISSIONS.EDIT_PROFILE, state),
  hasEditHqProfilePermission: checkPermission(PARTNER_PERMISSIONS.EDIT_HQ_PROFILE, state),
  hq: R.path(['partnerProfileDetails', 'partnerProfileDetails', 'identification', 'registration', 'hq'], state),
});

const connectedOrganizationProfileOverview = connect(
  mapStateToProps, mapDispatch)(OrganizationProfileOverview);

export default withRouter(connectedOrganizationProfileOverview);
