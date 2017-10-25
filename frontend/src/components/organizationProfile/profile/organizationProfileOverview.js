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

const FIRST_INDEX = 0;

const messages = {
  sections: [
    { label: 'Identification', notComplete: true },
    { label: 'Contact information', notComplete: false },
    { label: 'Mandate & Mission', notComplete: false },
    { label: 'Funding', notComplete: true },
    { label: 'Collaboration', notComplete: true },
    { label: 'Project Implementation', notComplete: false },
    { label: 'Other Information', notComplete: false },
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

  handleEditMode(sectionIndex) {
    const { partnerId } = this.props;

    this.props.changeTab(sectionIndex);
    history.push(`/profile/${partnerId}/edit`);
  }


  render() {
    return (
      <div>
        {messages.sections.map(item =>
          (<div>
            <CollapsableItem
              expanded={R.indexOf(item, messages.sections) === FIRST_INDEX}
              title={item.label}
              warning={item.notComplete}
              handleEditMode={() => this.handleEditMode(R.indexOf(item, messages.sections))}
              component={messages.sectionComponents[R.indexOf(item, messages.sections)]}
            />
            <Divider />
          </div>
          ))
        }
      </div>
    );
  }
}

OrganizationProfileOverview.propTypes = {
  changeTab: PropTypes.func.isRequired,
  partnerId: PropTypes.string.isRequired,
  loadPartnerProfileDetails: PropTypes.func,
};

const mapDispatch = dispatch => ({
  changeTab: index => dispatch(changeTab(index)),
  loadPartnerProfileDetails: partnerId => dispatch(loadPartnerDetails(partnerId)),
});

const mapStateToProps = (state, ownProps) => ({ partnerId: ownProps.params.id });

const connectedOrganizationProfileOverview = connect(
  mapStateToProps, mapDispatch)(OrganizationProfileOverview);

export default withRouter(connectedOrganizationProfileOverview);
