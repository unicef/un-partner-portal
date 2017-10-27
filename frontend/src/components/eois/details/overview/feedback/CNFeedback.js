import React from 'react';
import PropTypes from 'prop-types';
import Feedback from '../../../../applications/feedback/feedbackContainer';
import GridColumn from '../../../../common/grid/gridColumn';

const CNFeedback = (props) => {
  const { id } = props;
  return (
    <GridColumn>
      <Feedback
        applicationId={id}
      />
    </GridColumn>
  );
};


CNFeedback.propTypes = {
  id: PropTypes.string,
};

export default CNFeedback;
