import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import R from 'ramda';
import { connect } from 'react-redux'

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import NewCfeiModal from './newCfeiModal';

const messages = {
  calls: 'New cfei',
  direct: 'new direct selection',
};

const extractPath = router => R.last(router.location.pathname.split('/'));


class AgencyModals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  handleButtonClick() {
    this.setState({ modalOpen: true });
  }

  handleDialogClose() {
    this.setState({ modalOpen: false });
  }

  render() {
    const { router } = this.props;
    const { modalOpen } = this.state;
    const path = extractPath(router);
    debugger
    return (
      <Grid item>
        <Button
          raised
          color="accent"
          onClick={this.handleButtonClick}
        >
          {messages[path]}
        </Button>
        <NewCfeiModal path={path} open={modalOpen} onDialogClose={this.handleDialogClose} />
      </Grid>

    );
  }
}

AgencyModals.propTypes = {
  router: PropTypes.object,
};

const mapStateToProps = (state) => {
  debugger
}

export default withRouter(connect(mapStateToProps)(AgencyModals));
