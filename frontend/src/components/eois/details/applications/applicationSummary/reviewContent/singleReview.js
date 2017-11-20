import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import PaddedContent from '../../../../../common/paddedContent';
import { selectReviewer, selectAssessment } from '../../../../../../store';
import SpreadContent from '../../../../../common/spreadContent';
import TextWithColor from '../../../../../common/textWithColorBackground';
import AddReviewModalButton from './addReviewModalButton';
import EditReviewModalButton from './editReviewModalButton';
import SimpleCollapsableItem from '../../../../../common/simpleCollapsableItem';
import ExpandedAssessment from './expandedAssessment';

const messages = {
  you: 'You',
  date: 'Date of assessment',
  addReview: 'add review',
  notDone: 'NOT DONE',
  score: 'Total score',
};

const styleSheet = () => ({
  fullWidth: {
    width: '100%',
  },
  smallItem: {
    minWidth: '40%',
  },
  smallItem2: {
    minWidth: '45%',
  },
});

export const calcTotalScore = assessmentInfo => assessmentInfo.scores.reduce((total, nextScore) => {
  const newTotal = total + nextScore.score;
  return newTotal;
}, 0);

const markAsYou = (text, name, isYou) =>
  `${name.fullname} ${isYou ? ` (${messages.you})` : ''}`;

const SingleReview = (props) => {
  const { classes,
    reviewer,
    reviewerInfo,
    assessment,
    assessmentInfo,
    isReviewerCurrentUser } = props;
  return assessmentInfo
    ? (<SimpleCollapsableItem
      title={
        <PaddedContent className={classes.fullWidth}>
          <SpreadContent>
            <Typography>
              {markAsYou`${reviewerInfo}${isReviewerCurrentUser}`}
            </Typography>
            <SpreadContent notFullWidth className={classes.smallItem2} >
              <Typography type="caption" >
                {`${messages.date}: ${assessmentInfo.date_reviewed}`}
              </Typography>
              <Typography type="body2">
                {`${messages.score}: ${calcTotalScore(assessmentInfo)}`}
              </Typography>
              <EditReviewModalButton
                icon
                assessmentId={assessment}
                scores={assessmentInfo}
                reviewer={reviewer}
              />
            </SpreadContent>
          </SpreadContent>
        </PaddedContent >}
      component={<ExpandedAssessment assessmentInfo={assessmentInfo} />}
    />)
    : (<PaddedContent >
      <SpreadContent>
        <Typography>
          {markAsYou`${reviewerInfo}${isReviewerCurrentUser}`}
        </Typography>
        <SpreadContent notFullWidth className={classes.smallItem} >
          <TextWithColor color="red" text={messages.notDone} />
          <AddReviewModalButton reviewer={reviewer} />
        </SpreadContent>
      </SpreadContent>
    </PaddedContent >);
};

SingleReview.propTypes = {
  classes: PropTypes.object,
  reviewer: PropTypes.number,
  reviewerInfo: PropTypes.object,
  assessmentInfo: PropTypes.object,
  isReviewerCurrentUser: PropTypes.bool,
  assessment: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => {
  const reviewerInfo = selectReviewer(state, ownProps.reviewer);
  const assessmentInfo = ownProps.assessment && selectAssessment(state, ownProps.assessment);
  const currentUser = state.session.userId;
  const isReviewerCurrentUser = ownProps.reviewer == currentUser;
  return {
    reviewerInfo,
    assessmentInfo,
    isReviewerCurrentUser,
  };
};

export default connect(mapStateToProps)(withStyles(styleSheet)(SingleReview));
