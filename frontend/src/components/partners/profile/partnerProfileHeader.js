import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Flag from 'material-ui-icons/Flag';
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
    // this.props.loadPartnerVerifications();
  }

  updatePath() {
    const { tabs, location, partnerId } = this.props;
    if (tabs.findIndex(tab => location.match(`^/partner/${partnerId}/${tab.path}`)) === -1) {
      history.push('/');
    }

    return tabs.findIndex(tab => location.match(`^/partner/${partnerId}/${tab.path}`));
  }

  handleChange(event, index) {
    const { tabs, partnerId } = this.props;
    history.push(`/partner/${partnerId}/${tabs[index].path}`);
  }

  render() {
    const {
      tabs,
      children,
    } = this.props;

    const index = this.updatePath();
    return (
      <div>
        <HeaderNavigation
          backButton
          tabs={tabs}
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
