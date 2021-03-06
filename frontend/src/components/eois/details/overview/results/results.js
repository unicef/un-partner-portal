import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Result from './result';
import Feedback from '../../../../applications/feedback/feedbackContainer';
import { selectPartnerApplicationDetails } from '../../../../../store';
import AgencyResults from './agencyResults/resultsContainer';
import { ROLES } from '../../../../../helpers/constants';

const Results = (props) => {
  const { role, params: { id }, application } = props;
  if (role === ROLES.PARTNER) {
    return (
      <Grid container direction="row" spacing={24}>
        <Grid item xs={12} sm={4}>
          <Result cfeiId={id} application={application} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Feedback applicationId={application.id} />
        </Grid>
      </Grid>
    );
  }
  return <AgencyResults id={id} />;
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
