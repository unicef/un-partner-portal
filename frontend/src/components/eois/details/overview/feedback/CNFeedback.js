import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Feedback from '../../../../applications/feedback/feedbackContainer';
import GridColumn from '../../../../common/grid/gridColumn';
import { ROLES } from '../../../../../helpers/constants';

const CNFeedback = (props) => {
  const { id } = props;
  return (
    <GridColumn>
      <Feedback
        allowedToAdd
        applicationId={id}
      />
    </GridColumn>
  );
};


CNFeedback.propTypes = {
  id: PropTypes.string,
};
const mapStateToProps = state => ({
  allowedToAdd: state.session.role === ROLES.AGENCY,
});


export default connect(mapStateToProps)(CNFeedback);
