import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import MoreVert from 'material-ui-icons/MoreVert';
import Add from 'material-ui-icons/Add';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import GridColumn from '../../../common/grid/gridColumn';
import HeaderList from '../../../common/list/headerList';
import PaddedContent from '../../../common/paddedContent';

const messages = {
  verificationStatus: 'Verification status',
  addVerification: 'Add new Verification',
};

const styleSheet = createStyleSheet('HqProfileOverviewHeader', (theme) => {
  const paddingIcon = theme.spacing.unit;

  return {
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      width: 20,
      height: 20,
      margin: `0 ${paddingIcon}px 0 0`,
    },
  };
});


const Fields = () => (
  <PaddedContent>
    <GridColumn />
  </PaddedContent>
);


class PartnerOverviewVerification extends React.Component {
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

  summaryHeader() {
    return (
      <Grid container align="center" direction="row">
        <Grid item xs={10}>
          <Typography type="title" >{messages.verificationStatus}</Typography>
        </Grid>
        <Grid item xs={2}>
          <IconButton onClick={event => this.handleClick(event)}>
            <MoreVert />
          </IconButton>
        </Grid>
      </Grid>);
  }

  render() {
    const { partner, classes } = this.props;
    return (
      <div>
        <HeaderList
          headerObject={this.summaryHeader()}
          rows={[]}
        />
        <Menu
          id="verificationMenu"
          anchorEl={this.state.anchorPoint}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        >
          <MenuItem onClick={this.handleRequestClose}>
            <div className={classes.root}>
              <Add className={classes.icon} />
              {messages.addVerification}
            </div>
          </MenuItem>
        </Menu>
      </div>);
  }
}

PartnerOverviewVerification.propTypes = {
  classes: PropTypes.object.isRequired,
  partner: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(PartnerOverviewVerification);
