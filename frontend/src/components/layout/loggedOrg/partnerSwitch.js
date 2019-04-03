import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import { browserHistory as history, withRouter } from 'react-router';
import GridRow from '../../common/grid/gridRow';
import { sessionChange, sessionInitializing, loadUserData } from '../../../reducers/session';

const styleSheet = theme => ({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  icon: {
    color: theme.palette.secondary[500],
  },
});

class PartnerSwitch extends Component {
  constructor() {
    super();
    this.state = {
      anchorEl: null,
      open: false,
    };
  }

  handleClick = (event) => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  }

  onClose = () => {
    this.setState({ open: false });
  }

  handleRequest = (partner) => {
    const { startRefresh, stopRefresh, isCurrentHq, currentHqId, partnerId, loadUserInfo } = this.props;

    this.props.saveNewCurrentPartner({
      partnerId: partner.id,
      partnerCountry: partner.country_code,
      partnerName: partner.legal_name,
      isHq: partner.is_hq,
      hqId: currentHqId || isCurrentHq ? partnerId : null,
      logo: partner.logo,
      logoThumbnail: R.prop('org_logo_thumbnail', partner) || partner.logoThumbnail,
      isProfileComplete: partner.partner_additional.has_finished,
      lastUpdate: partner.last_profile_update,
    });

    this.onClose();

    const loc = history.getCurrentLocation(); 

    if (R.contains('profile',loc.pathname)) {
      const splitPath = R.split('/', loc.pathname); 
      splitPath[2] = partner.id;

      loc.pathname = splitPath.join('/');
    }
    
    startRefresh();
    history.push('/');

    loadUserInfo().then(() => {
      history.push(loc);
      stopRefresh();
    })
  }

  renderMenuItems(partners = [], countries = {}) {
    return partners.map(partner => (
      <MenuItem
        key={partner.id}
        onClick={() => this.handleRequest(partner)}
        selected={partner.id === this.props.partnerId}
      >
        <Typography type="body2">
          {`${countries[partner.country_code]} ${partner.is_hq ? ' - HQ' : ''}`}
        </Typography>
      </MenuItem>
    ));
  }

  render() {
    const { classes, partners, partnerId, partnerCountry, countries } = this.props;
    const partner = R.find(R.propEq('id', partnerId))(partners);
    return (
      <div>
        <GridRow alignItems="center">
          <Typography type="body2">
            {`${partnerCountry} ${partner && partner.is_hq ? ' - HQ' : ''}`}
          </Typography>
          <IconButton
            className={classNames(classes.icon, classes.expand, {
              [classes.expandOpen]: this.state.open,
            })}
            onClick={this.handleClick}
            aria-haspopup="true"
            aria-label="switch-partner"
          >
            <ExpandMoreIcon />
          </IconButton>
        </GridRow>
        <Menu
          id="switch-partner"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.onClose}
        >
          {this.renderMenuItems(partners, countries)}
        </Menu>
      </div>
    );
  }
}

PartnerSwitch.propTypes = {
  classes: PropTypes.object.isRequired,
  partners: PropTypes.array,
  partnerCountry: PropTypes.string,
  countries: PropTypes.object,
  name: PropTypes.string,
  saveNewCurrentPartner: PropTypes.func,
  loadUserInfo: PropTypes.func,
  partnerId: PropTypes.number,
  isCurrentHq: PropTypes.bool,
  currentHqId: PropTypes.number,
  stopRefresh: PropTypes.func,
  startRefresh: PropTypes.func,

};

const mapStateToProps = state => ({
  name: state.session.partnerName,
  partners: state.session.partners,
  partnerCountry: state.countries[state.session.partnerCountry],
  countries: state.countries,
  partnerId: state.session.partnerId,
  isCurrentHq: state.session.isHq,
  currentHqId: state.session.hqId,
});

const mapDispatchToProps = dispatch => ({
  saveNewCurrentPartner: session => dispatch(sessionChange(session)),
  loadUserInfo: () => dispatch(loadUserData()),
  startRefresh: () => dispatch(sessionInitializing()),
  stopRefresh: () => dispatch(sessionChange()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styleSheet, { name: 'PartnerSwitch' })(PartnerSwitch));
