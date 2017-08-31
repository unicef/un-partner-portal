import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { browserHistory as history } from 'react-router';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Tabs from 'material-ui/Tabs';
import ControlledModal from '../../common/modals/controlledModal';
import OpenForm from './openForm'

const messages = {
  title: 'Create new Call for Expressions of Interests',
};

class NewCfeiModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) this.setState({ modalOpen: true })
  }

  handleSubmit(values) {
    debugger
    this.setState({ modalOpen: false });
  }

  handleDialogClose() {
    this.setState({ modalOpen: false });
  }

  render() {
    const { classes, open, location } = this.props;
    const { modalOpen } = this.state;
    return (
      <Grid item>
        <ControlledModal
          title={messages.title}
          trigger={modalOpen}
          content={<OpenForm
            onSubmit={this.handleSubmit}
            onCancel={this.handleDialogClose}
          />}
        />
      </Grid>
    );
  }
}

export default NewCfeiModal;

