import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import HeaderNavigation from '../../../../common/headerNavigation';
import {
  selectApplicationStatus,
  selectApplicationPartnerName,
} from '../../../../../store';
import { loadApplication } from '../../../../../reducers/applicationDetails';
import { loadPartnerNames } from '../../../../../reducers/partnerNames';
import ApplicationStatusText from '../applicationStatusText';
import GridRow from '../../../../common/grid/gridRow';

const messages = {
  header: 'Application from :',
  noCfei: 'Sorry but this application doesn\'t exist',
  button: 'edit review',
};

class ApplicationSummaryHeader extends Component {
  constructor() {
    super();
    this.state = {
      index: 0,
    };
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  handleBackButton() {
    const { params: { type, id } } = this.props;
    history.push(`/cfei/${type}/${id}/applications`);
  }

  renderContent() {
    const {
      partner,
      status,
      children,
      params: { type },
      error,
    } = this.props;
    if (error.notFound) {
      return <Typography >{messages.noApplication}</Typography>;
    } else if (error.message) {
      return <Typography >{error.message}</Typography>;
    }
    return (<HeaderNavigation
      title={`${messages.header} ${partner}`}
      header={<GridRow align="center">
        <ApplicationStatusText status={status} />
        <Button raised color="accent">{messages.button}</Button>
      </GridRow>
      }
      backButton
      handleBackButton={this.handleBackButton}
    >
      {children}
    </HeaderNavigation>);
  }

  render() {
    return (
      <Grid item>
        {this.renderContent()}
      </Grid>
    );
  }
}

ApplicationSummaryHeader.propTypes = {
  partner: PropTypes.string,
  status: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.node,
  params: PropTypes.object,
  error: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  status: selectApplicationStatus(state, ownProps.params.applicationId),
  partner: selectApplicationPartnerName(state, ownProps.params.applicationId),
  loading: state.applicationDetails.status.loading,
  error: state.applicationDetails.status.error,
});

const containerApplicationSummaryHeader = connect(
  mapStateToProps,
)(ApplicationSummaryHeader);

export default containerApplicationSummaryHeader;
