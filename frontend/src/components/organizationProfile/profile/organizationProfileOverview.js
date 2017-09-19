import R from 'ramda';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
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
    <PartnerProfileIdentification />,
    <PartnerProfileContactInfo />,
    <PartnerProfileMandate />,
    <PartnerProfileFunding />,
    <PartnerProfileCollaboration />,
    <PartnerProfileProjectImplementation />,
    <PartnerProfileOtherInfo />,
  ],
};

class OrganizationProfileOverview extends Component {
  handleEditMode(sectionIndex) {
    const { countryCode } = this.props;

    this.props.changeTab(sectionIndex);
    history.push(`/profile/${countryCode}/edit`);
  }

  render() {
    return (
      <Paper>
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
      </Paper>
    );
  }
}

OrganizationProfileOverview.propTypes = {
  changeTab: PropTypes.func.isRequired,
  countryCode: PropTypes.string.isRequired,
};

const mapDispatch = dispatch => ({
  changeTab: index => dispatch(changeTab(index)),
});

const mapStateToProps = (state, ownProps) => ({
  countryCode: ownProps.params.countryCode,
});


export default connect(mapStateToProps, mapDispatch)(OrganizationProfileOverview);
