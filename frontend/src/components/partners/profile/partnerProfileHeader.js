
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import React from 'react';
import MoreVert from 'material-ui-icons/MoreVert';
import Cancel from 'material-ui-icons/Cancel';
import Menu, { MenuItem } from 'material-ui/Menu';
import { withStyles, createStyleSheet } from 'material-ui/styles';

const messages = {
  deactivate: 'Deactivate Profile',
};

const styleSheet = createStyleSheet('HqProfileOverviewHeader', (theme) => {
  const paddingSmall = theme.spacing.unit * 3;
  const paddingIcon = theme.spacing.unit;

  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: `${paddingSmall}px`,
    },
    icon: {
      width: 20,
      height: 20,
      margin: `0 ${paddingIcon}px 0 0`,
    },
  };
});


class PartnerProfileHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorPoint: undefined,
      open: false,
    };

    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleClick(event) {
    this.setState({ open: true, anchorPoint: event.currentTarget });
  }

  handleOpenMenu() {
    this.setState({ open: false });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <IconButton onClick={event => this.handleClick(event)} >
          <MoreVert />
        </IconButton>
        <Menu
          id="deactivateMenu"
          anchorEl={this.state.anchorPoint}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        >
          <MenuItem onClick={this.handleRequestClose}>
            <div className={classes.root}>
              <Cancel className={classes.icon} />
              {messages.deactivate}
            </div>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

PartnerProfileHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  handleMoreClick: PropTypes.func.isRequired,
};

export default withStyles(styleSheet)(PartnerProfileHeader);
