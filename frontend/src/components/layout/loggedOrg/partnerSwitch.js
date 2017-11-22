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
import { sessionChange, sessionInitializing } from '../../../reducers/session';

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
    this.handleClick = this.handleClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleClick(event) {
    this.setState({ open: true, anchorEl: event.currentTarget });
  }

  handleRequestClose(partner) {
    if (partner.id) {
      this.props.saveNewCurrentPartner({
        partnerId: partner.id,
        partnerCountry: partner.country_code,
        partnerName: partner.legal_name,
        isHq: partner.is_hq,
        logo: partner.logo,
        isProfileComplete: partner.partner_additional.has_finished,
      });

      this.setState({ open: false });
      const loc = history.getCurrentLocation();
      this.props.startRefresh();
      history.push('/');
      setTimeout(() => {
        history.push(loc);
        this.props.stopRefresh();
      }, 100);
    }

    this.setState({ open: false });
  }

  renderMenuItems(partners, countries) {
    return partners.map(partner => (
      <MenuItem
        key={partner.id}
        onClick={() => this.handleRequestClose(partner)}
        selected={partner.id === this.props.partnerId}
      >
        <Typography type="body2">
          {`${partner.legal_name}, ${countries[partner.country_code]} `}
        </Typography>
      </MenuItem>
    ));
  }

  render() {
    const { classes, partners, name, partnerCountry, countries } = this.props;
    return (
      <div>
        <GridRow alignItems="center">
          <Typography type="body2">
            {name}
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
        <Typography type="body2">
          {`${name}, ${partnerCountry} `}
        </Typography>
        <Menu
          id="switch-partner"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
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
  partnerId: PropTypes.number,
};

const mapStateToProps = state => ({
  name: state.session.partnerName,
  partners: state.session.partners,
  partnerCountry: state.countries[state.session.partnerCountry],
  countries: state.countries,
  partnerId: state.session.partnerId,
});

const mapDispatchToProps = dispatch => ({
  saveNewCurrentPartner: session => dispatch(sessionChange(session)),
  startRefresh: () => dispatch(sessionInitializing()),
  stopRefresh: () => dispatch(sessionChange()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styleSheet, { name: 'PartnerSwitch' })(PartnerSwitch));
