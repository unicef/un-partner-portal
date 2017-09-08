import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import MoreVert from 'material-ui-icons/MoreVert';
import Flag from 'material-ui-icons/Flag';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import GridColumn from '../../../common/grid/gridColumn';
import HeaderList from '../../../common/list/headerList';
import PaddedContent from '../../../common/paddedContent';

const messages = {
  flagStatus: 'Flag status',
  updated: 'Last updated: ',
  addYellowFlag: 'Add yellow flag',
  addRedFlag: 'Add red flag',
  none: 'None',
};

const styleSheet = createStyleSheet('HqProfileOverviewHeader', (theme) => {
  const paddingIcon = theme.spacing.unit;

  return {
    root: {
      display: 'flex',
      alignItems: 'center',
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
});

class PartnerOverviewFlag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorPoint: undefined,
      open: false,
    };

    this.flagHeader = this.flagHeader.bind(this);
    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }


  flags() {
    return (
      <PaddedContent>
        <GridColumn />
      </PaddedContent>
    );
  }

  none() {
    return (
      <PaddedContent big>
        {messages.none}
      </PaddedContent>);
  }

  flagHeader() {
    return (
      <Grid container align="center" justify="space-between" direction="row">
        <Grid item xs={10}>
          <Typography type="title" >{messages.flagStatus}</Typography>
        </Grid>
        <Grid item xs={2}>
          <IconButton
            aria-owns={this.state.open ? 'flagMenu' : null}
            aria-haspopup="true"
            onClick={event => this.handleClick(event)}
          >
            <MoreVert />
          </IconButton>
        </Grid>
      </Grid>);
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
    const { classes, partner, flags } = this.props;

    return (
      <div>
        <HeaderList
          headerObject={this.flagHeader(partner.lastUpdate)}
          rows={flags ? this.fields() : [this.none()]}
        />
        <Menu
          id="flagMenu"
          anchorEl={this.state.anchorPoint}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        >
          <MenuItem onClick={this.handleRequestClose}>
            <div className={classes.root}>
              <Flag className={classes.iconYellow} />
              {messages.addYellowFlag}
            </div>
          </MenuItem>
          <MenuItem onClick={this.handleRequestClose}>
            <div className={classes.root}>
              <Flag className={classes.iconRed} />
              {messages.addRedFlag}
            </div>
          </MenuItem>
        </Menu>
      </div>);
  }
}

PartnerOverviewFlag.propTypes = {
  classes: PropTypes.object.isRequired,
  partner: PropTypes.object.isRequired,
  flags: PropTypes.array,
};

export default withStyles(styleSheet)(PartnerOverviewFlag);
