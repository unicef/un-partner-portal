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

class AgencySwitch extends Component {
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

  handleRequestClose(office) {
    const { startRefresh, stopRefresh } = this.props;

    if (office.id) {
      this.props.saveNewCurrentOffice({
        officeId: office.office.id,
        officeName: office.office.name,
        officeRole: office.role_display,
        permissions: office.permissions,
        officeCountryCode: office.office.country,
      });

      this.setState({ open: false });
      const loc = history.getCurrentLocation();
      startRefresh();
      history.push('/');
      setTimeout(() => {
        history.push(loc);
        stopRefresh();
      }, 100);
    }

    this.setState({ open: false });
  }

  renderMenuItems(offices = []) {
    return offices.map(office => (
      <MenuItem
        key={office.office.id}
        onClick={() => this.handleRequestClose(office)}
        selected={office.office.id === this.props.officeId}
      >
        <Typography type="body2">
          {office.office.name}
        </Typography>
      </MenuItem>
    ));
  }

  render() {
    const { classes, offices, name, agencyName } = this.props;
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
            aria-label="switch-office"
          >
            <ExpandMoreIcon />
          </IconButton>
        </GridRow>
        <Menu
          id="switch-office"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleRequestClose}

        >
          {this.renderMenuItems(offices)}
        </Menu>
      </div>
    );
  }
}

AgencySwitch.propTypes = {
  classes: PropTypes.object.isRequired,
  offices: PropTypes.array,
  agencyName: PropTypes.string,
  name: PropTypes.string,
  saveNewCurrentOffice: PropTypes.func,
  officeId: PropTypes.number,
  stopRefresh: PropTypes.func,
  startRefresh: PropTypes.func,
};

const mapStateToProps = state => ({
  name: state.session.officeName,
  agencyName: state.session.agencyName,
  offices: state.session.offices,
  countries: state.countries,
  officeId: state.session.officeId,
});

const mapDispatchToProps = dispatch => ({
  saveNewCurrentOffice: session => dispatch(sessionChange(session)),
  startRefresh: () => dispatch(sessionInitializing()),
  stopRefresh: () => dispatch(sessionChange()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styleSheet, { name: 'AgencySwitch' })(AgencySwitch));
