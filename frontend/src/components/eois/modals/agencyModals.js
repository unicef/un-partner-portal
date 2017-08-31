import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';


import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import NewCfeiModal from './newCfeiModal';

const messages = {
  calls: 'New cfei',
  direct: 'new direct selection',
};

class AgencyModals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick() {
    this.setState({ modalOpen: true });
  }

  render() {
    const { modalOpen } = this.state;
    return (
      <Grid item>
        <Button
          raised
          color="accent"
          onClick={this.handleButtonClick}
        >
          {messages.calls}
        </Button>
        <NewCfeiModal open={modalOpen} />
      </Grid>

    );
  }
}

export default withRouter(AgencyModals);
