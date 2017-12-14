import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Divider from 'material-ui/Divider';
import GridColumn from '../../../../../common/grid/gridColumn';
import PaddedContent from '../../../../../common/paddedContent';
import SpreadContent from '../../../../../common/spreadContent';

const messages = {
  criteria: 'Criteria',
  score: 'Score',
  notes: 'Notes',
};

const styleSheet = () => ({
  spread: {
    width: '100%',
    background: '#F6F6F6',
  },
});

const ExpandedAssessment = (props) => {
  const { classes, allCriteria, assessmentInfo } = props;
  return (
    <div className={classes.spread}>
      <PaddedContent>
        <GridColumn>
          <SpreadContent>
            <Typography type="caption">{messages.criteria}</Typography>
            <Typography type="caption">{messages.score}</Typography>
          </SpreadContent>
          <Divider />
          {assessmentInfo.scores.map((assessment, index) => (<div key={index}>
            <SpreadContent>
              <Typography>
                {allCriteria[assessment.selection_criteria]}
              </Typography>
              <Typography>
                {assessment.score}
              </Typography>
            </SpreadContent>
            <Divider />
          </div>))}
          {assessmentInfo.note && <div>
            <Typography type="caption">{messages.notes}</Typography>
            <Typography>{assessmentInfo.note}</Typography>
          </div>}
        </GridColumn>
      </PaddedContent>
    </div>
  );
};

ExpandedAssessment.propTypes = {
  classes: PropTypes.object,
  reviewer: PropTypes.number,
  reviewerInfo: PropTypes.object,
  assessmentInfo: PropTypes.object,
  isReviewerCurrentUser: PropTypes.bool,
  assessment: PropTypes.number,
  allCriteria: PropTypes.object,
};

const mapStateToProps = state => ({
  allCriteria: state.selectionCriteria,
});

export default connect(
  mapStateToProps)(withStyles(styleSheet)(ExpandedAssessment));
