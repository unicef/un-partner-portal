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


const messages = {
  you: 'You',
  date: 'Date of assessment',
  addReview: 'add review',
  notDone: 'NOT DONE',
};

const styleSheet = () => ({
  smallItem: {
    minWidth: '40%',
  },
});

const markAsYou = (text, name, isYou) =>
  `${name.first_name} ${name.last_name}${isYou ? ` (${messages.you})` : ''}`;

const SingleReview = (props) => {
  const { classes, reviewer, reviewerInfo, assessmentInfo, isReviewerCurrentUser } = props;
  return (
    <PaddedContent >
      <SpreadContent >
        <Typography>{markAsYou`${reviewerInfo}${isReviewerCurrentUser}`}</Typography>
        {assessmentInfo
          ? <div>
            <Typography >{`${messages.date}: ${assessmentInfo.date_reviewed}`}</Typography>
          </div>
          : <SpreadContent notFullWidth className={classes.smallItem} >
            <TextWithColor color="red" text={messages.notDone} />
            <AddReviewModalButton reviewer={reviewer} />
          </SpreadContent>
        }

      </SpreadContent>
    </PaddedContent>
  );
};

SingleReview.propTypes = {
  classes: PropTypes.object,
  reviewer: PropTypes.number,
  reviewerInfo: PropTypes.object,
  assessmentInfo: PropTypes.object,
  isReviewerCurrentUser: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const reviewerInfo = selectReviewer(state, ownProps.reviewer);
  const assessmentInfo = ownProps.assessment && selectAssessment(state, ownProps.assessment);
  const currentUser = state.session.userId;
  const isReviewerCurrentUser = ownProps.reviewer === currentUser;
  return {
    reviewerInfo,
    assessmentInfo,
    isReviewerCurrentUser,
  };
};

export default connect(mapStateToProps)(withStyles(styleSheet)(SingleReview));
