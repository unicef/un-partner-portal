import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import MyResponse from './myResponse';
import Feedback from '../../../../applications/feedback/feedbackContainer';
import { selectPartnerApplicationDetails } from '../../../../../store';
import { ROLES } from '../../../../../helpers/constants';
import { checkPermission, PARTNER_PERMISSIONS } from '../../../../../helpers/permissions';

const Results = (props) => {
  const { role, hasPermission, params: { id }, application } = props;
  if (role === ROLES.PARTNER) {
    return (
      <Grid container direction="row" spacing={24}>
        <Grid item xs={12} sm={8}>
          <Feedback applicationId={application.id} />
        </Grid>
        <Grid item xs={12} sm={4}>
          {hasPermission && <MyResponse cfeiId={id} application={application} />}
        </Grid>
      </Grid>
    );
  }
  return <div />;
};

Results.propTypes = {
  role: PropTypes.string,
  hasPermission: PropTypes.bool,
  params: PropTypes.object,
  application: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  role: state.session.role,
  application: selectPartnerApplicationDetails(state, ownProps.params.id),
  hasPermission: checkPermission(PARTNER_PERMISSIONS.DSR_ANSWER, state),
});

export default connect(mapStateToProps)(Results);
