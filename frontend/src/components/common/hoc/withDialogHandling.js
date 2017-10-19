import React, { Component } from 'react';


export default WrappedComponent =>
  class WithDialogHandle extends Component {
    constructor(props) {
      super(props);
      this.state = {
        dialogOpen: false,
      };
      this.handleDialogOpen = this.handleDialogOpen.bind(this);
      this.handleDialogClose = this.handleDialogClose.bind(this);
    }

    handleDialogOpen() {
      this.setState({ dialogOpen: true });
    }

    handleDialogClose() {
      this.setState({ dialogOpen: false });
    }

    render() {
      return (
        <WrappedComponent
          dialogOpen={this.state.dialogOpen}
          handleDialogOpen={this.handleDialogOpen}
          handleDialogClose={this.handleDialogClose}
          {...this.props}
        />);
    }
  };
