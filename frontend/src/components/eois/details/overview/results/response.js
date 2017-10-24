import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import MyResponse from './myResponse';
import Feedback from './feedback';
import { selectPartnerApplicationDetails } from '../../../../../store';
import { ROLES } from '../../../../../helpers/constants';

const Results = (props) => {
  const { role, params: { id }, application } = props;
  if (role === ROLES.PARTNER) {
    return (
      <Grid container direction="row">
        <Grid item xs={12} sm={8}>
          <Feedback feedback={application.feedback} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MyResponse cfeiId={id} application={application} />
        </Grid>
      </Grid>
    );
  }
  return <div />;
};

Results.propTypes = {
  role: PropTypes.string,
  params: PropTypes.object,
  application: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  role: state.session.role,
  application: selectPartnerApplicationDetails(state, ownProps.params.id),
});

export default connect(mapStateToProps)(Results);
