import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import { withStyles } from 'material-ui/styles';
import VerifiedUser from 'material-ui-icons/VerifiedUser';
import Flag from 'material-ui-icons/Flag';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import PartnerProfileHeaderMenu from './partnerProfileHeaderMenu';
import HeaderNavigation from '../../../components/common/headerNavigation';
import {
  loadPartnerDetails,
} from '../../../reducers/partnerProfileDetails';
import {
  loadPartnerVerifications,
} from '../../../reducers/partnerVerifications';

const styleSheet = (theme) => {
  const paddingIcon = theme.spacing.unit;

  return {
    alignCenter: {
      display: 'flex',
      alignItems: 'center',
    },
    iconNotVerified: {
      fill: theme.palette.primary[500],
      width: 20,
      height: 20,
      margin: `0 0 0 ${paddingIcon}px`,
    },
    iconVerified: {
      fill: '#009A54',
      width: 20,
      height: 20,
      margin: `0 0 0 ${paddingIcon}px`,
    },
    iconYellow: {
      fill: '#FFC400',
      width: 20,
      height: 20,
      margin: `0 ${paddingIcon}px 0 0`,
    },
    iconRed: {
      fill: '#D50000',
      width: 20,
      height: 20,
      margin: `0 ${paddingIcon}px 0 0`,
    },
  };
};

const PartnerTitle = (props) => {
  const { classes, partner } = props;

  return (
    <div className={classes.alignCenter}>
      <Typography type="headline">
        {partner.name}
      </Typography>
      <VerifiedUser className={partner.verified ? classes.iconVerified : classes.iconNotVerified} />
      {partner.flagYellow && <Flag className={classes.iconYellow} />}
      {partner.flagRed && <Flag className={classes.iconRed} />}
    </div>);
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
    this.props.loadPartnerDetails();
  }

  partnerTitle() {
    const { classes, partner } = this.props;

    return (
      <div className={classes.alignCenter}>
        <Typography type="headline">
          {partner.name}
        </Typography>
        <VerifiedUser
          className={partner.verified ? classes.iconVerified : classes.iconNotVerified}
        />
        {partner.flagYellow && <Flag className={classes.iconYellow} />}
        {partner.flagRed && <Flag className={classes.iconRed} />}
      </div>);
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
          handleBackButton={() => { history.goBack(); }}
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
  classes: PropTypes.object.isRequired,
  tabs: PropTypes.array.isRequired,
  children: PropTypes.node,
  location: PropTypes.string.isRequired,
  partner: PropTypes.object.isRequired,
  partnerId: PropTypes.string.isRequired,
  loadPartnerDetails: PropTypes.func,
};

PartnerTitle.propTypes = {
  classes: PropTypes.object.isRequired,
  partner: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  tabs: state.agencyPartnerProfileNav.tabs,
  partner: state.agencyPartnerProfile[ownProps.params.id] || {},
  profile: state.organizationProfile[ownProps.params.id],
  partnerId: ownProps.params.id,
  location: ownProps.location.pathname,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onItemClick: (id, path) => {
    history.push(path);
  },
  loadPartnerDetails: () => dispatch(loadPartnerDetails(ownProps.params.id)),
  loadPartnerVerifications: () => dispatch()
});

const connectedPartnerProfile = connect(mapStateToProps, mapDispatchToProps)(PartnerProfileHeader);
const connectedPartnerTitle = connect(mapStateToProps)(PartnerTitle);
withStyles(styleSheet, { name: '' })(connectedPartnerTitle);

export default withStyles(styleSheet, { name: 'PartnerProfileHeader' })(connectedPartnerProfile);

