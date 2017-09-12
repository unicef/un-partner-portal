import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import R from 'ramda';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import NewCfeiModal from './newCfeiModal';

const messages = {
  open: 'New cfei',
  direct: 'new direct selection',
};


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
    const { params: { type } } = this.props;
    const { modalOpen } = this.state;
    return (
      <Grid item>
        <Button
          raised
          color="accent"
          onClick={this.handleButtonClick}
        >
          {messages[type]}
        </Button>
        <NewCfeiModal type={type} open={modalOpen} onDialogClose={this.handleDialogClose} />
      </Grid>

    );
  }
}

AgencyModals.propTypes = {
  params: PropTypes.object,
};


export default withRouter(AgencyModals);
