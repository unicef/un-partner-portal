import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import CollapsableItem from '../../../../../components/common/collapsableItem';
import SpreadContent from '../../../../../components/common/spreadContent';
import PartnerUnAgencyData from './partnerUnAgencyData';
import { loadPartnerDetails } from '../../../../../reducers/partnerProfileDetails';
import { ROLES } from '../../../../../helpers/constants';

const agencies = {
  sections: [
    { label: 'UNHCR',
      id: 3 },
    { label: 'UNICEF',
      id: 1 },
    { label: 'WFP',
      id: 2 },
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
            title={
              item.id === 3
                ? <SpreadContent>
                  {item.label}
                  <Button style={{ marginRight: '10px' }} color="accent" onClick={() => window.open('https://partner.unhcr.org/_layouts/15/partnerportal/anonymous/landingview.aspx')}>{'UNHCR Partner Portal'}</Button>
                </SpreadContent>
                : item.label
            }
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
