import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import CollapsableItem from '../../../../../components/common/collapsableItem';
import PartnerUnAgencyData from './partnerUnAgencyData';
import { loadPartnerDetails } from '../../../../../reducers/partnerProfileDetails';
import { ROLES } from '../../../../../helpers/constants';

const agencies = {
  sections: [
    { label: 'UNHCR' },
    { label: 'UNICEF' },
    { label: 'WFP' },
  ],
  sectionComponents: [
    <PartnerUnAgencyData agencyId={3} />,
    <PartnerUnAgencyData agencyId={1} />,
    <PartnerUnAgencyData agencyId={2} />,
  ],
};


class PartnerUnDataOverview extends Component {
  componentDidMount() {
    const { role } = this.props;

    if (role === ROLES.PARTNER) {
      this.props.loadPartnerProfileDetails();
    }
  }

  render() {
    return (<Paper>
      {agencies.sections.map(item =>
        (<div key={item.label}>
          <CollapsableItem
            warning
            title={item.label}
            component={agencies.sectionComponents[R.indexOf(item, agencies.sections)]}
          />
          <Divider />
        </div>
        ))
      }
    </Paper>);
  }
}

PartnerUnDataOverview.propTypes = {
  loadPartnerProfileDetails: PropTypes.func,
  role: PropTypes.string,
};

const mapDispatch = (dispatch, ownProps) => ({
  loadPartnerProfileDetails: () => dispatch(loadPartnerDetails(ownProps.params.id)),
});

const mapStateToProps = state => ({
  role: state.session.role,
});

const connected = connect(mapStateToProps, mapDispatch)(PartnerUnDataOverview);

export default withRouter(connected);
