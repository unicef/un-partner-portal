import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import SidebarMenu from "./sidebarMenu";
import MainAppBar from "./appBar";

// TODO check what can be done in muiTheme
const styleSheet = theme => ({
  root: {
    margin: "auto",
    display: "grid",
    // '-ms-grid-columns': '224px 1fr',
    // gridTemplateColumns: '224px auto',
    // '-ms-grid-rows': `${theme.spacing.unit * 8}px 1fr`,
    // gridTemplateRows: `${theme.spacing.unit * 8}px auto`,
    // height: '100vh',
    width: "100vw"
  },
  rightItem: {
    overflow: "scroll",
    background: theme.palette.primary[200],
    marginLeft: theme.spacing.unit * 28,
    top: 0,
  },
  border: {},
  fullWidth: {
    [theme.breakpoints.down("md")]: {
      "-ms-grid-column-span": 2,
      gridColumnEnd: "span 2"
    }
  },
  leftItem: {
    borderRight: `2px ${theme.palette.primary[300]} solid`,
    position: "fixed",
    width: theme.spacing.unit * 28,
    height: 'calc(100% - 70px)',
  },
  noPrint: {
    "@media print": {
      display: "none"
    }
  }
});

class MainLayout extends Component {
  constructor() {
    super();
    this.state = {
      notifAnchor: null,
      profileAnchor: null,
      verificationOpen: false,
      profileOpen: false
    };
    this.handleVerificationClick = this.handleVerificationClick.bind(this);
    this.handleVerificationClose = this.handleVerificationClose.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleProfileRequestClose = this.handleProfileRequestClose.bind(this);
  }

  handleVerificationClick(event) {
    this.setState({ verificationOpen: true, notifAnchor: event.currentTarget });
  }

  handleVerificationClose() {
    this.setState({ verificationOpen: false });
  }

  handleProfileClick(event) {
    this.setState({ profileOpen: true, profileAnchor: event.currentTarget });
  }

  handleProfileRequestClose() {
    this.setState({ profileOpen: false });
  }

  render() {
    const { classes, children } = this.props;
    return (
      <div className={classes.root}>
        <MainAppBar />
        <div style={{ display: "flex", marginTop: 72 }}>
          <div className={classes.leftItem}>
            <SidebarMenu />
          </div>
          <div className={classes.rightItem}>{children}</div>
        </div>
      </div>
    );
  }
}

MainLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

export default withStyles(styleSheet, { name: "mainLayout" })(MainLayout);
