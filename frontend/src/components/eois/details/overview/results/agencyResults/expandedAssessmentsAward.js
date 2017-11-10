import React from 'react';
import { connect } from 'react-redux';
import R from 'ramda';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Divider from 'material-ui/Divider';
import GridColumn from '../../../../../common/grid/gridColumn';
import PaddedContent from '../../../../../common/paddedContent';
import SpreadContent from '../../../../../common/spreadContent';
import FileDownloadButton from '../../../../../common/buttons/fileDownloadButton';
import { formatDateForPrint } from '../../../../../../helpers/dates';

const messages = {
  criteria: 'Criteria',
  score: 'Average score',
  notes: 'Notes',
  reviewer: 'Reviewer',
  total: 'Average total score',
  number: 'Number of completed assessments',
  accepted: 'Acccepted by Partner',
  notified: 'Partner notified',
  no: 'no',
};

const styleSheet = theme => ({
  lightGrey: {
    width: '100%',
    background: theme.palette.common.lightGreyBackground,
  },
  darkGrey: {
    width: '100%',
    background: theme.palette.common.darkGreyBackground,
  },

});

const ExpandedAssessment = (props) => {
  const { classes,
    allCriteria,
    criteriaMap,
    notes,
    avgTotalScore,
    assessmentCount,
    notifDate,
    acceptedDate,
  } = props;
  return (
    <div>
      <PaddedContent className={classes.lightGrey}>
        <GridColumn>
          <SpreadContent>
            <Typography type="caption">{messages.criteria}</Typography>
            <Typography type="caption">{messages.score}</Typography>
          </SpreadContent>
          <Divider />
          {criteriaMap.map(([criteria, { avg }], index) => (<div key={index}>
            <SpreadContent>
              <Typography>{allCriteria[criteria]}</Typography>
              <Typography>{avg}</Typography>
            </SpreadContent>
            <Divider />
          </div>))}
          <SpreadContent>
            <Typography type="body2">{messages.total}</Typography>
            <Typography >{avgTotalScore}</Typography>
          </SpreadContent>
          <Divider />
          <SpreadContent>
            <Typography>{messages.number}</Typography>
            <Typography>{assessmentCount}</Typography>
          </SpreadContent>
          <Divider />
          <SpreadContent>
            <Typography type="caption">{messages.notes}</Typography>
            <Typography type="caption">{messages.reviewer}</Typography>
          </SpreadContent>
          {notes.map(({ note, reviewer }, index) => (<div key={index}>
            <SpreadContent>
              <Typography>{note}</Typography>
              <Typography>{reviewer}</Typography>
            </SpreadContent>
            <Divider />
          </div>))}
        </GridColumn>
      </PaddedContent>
      <PaddedContent className={classes.darkGrey}>
        <SpreadContent>
          <Typography type="caption">{`${messages.notified}: ${formatDateForPrint(notifDate) || messages.no}`}</Typography>
          <Typography type="caption">{`${messages.accepted}: ${formatDateForPrint(acceptedDate) || messages.no}`}</Typography>
          <FileDownloadButton fileUrl={null} />
        </SpreadContent>
      </PaddedContent>
      <Divider />
    </div>
  );
};

ExpandedAssessment.propTypes = {
  classes: PropTypes.object,
  notifDate: PropTypes.string,
  acceptedDate: PropTypes.string,
  criteriaMap: PropTypes.array,
  assessmentCount: PropTypes.number,
  avgTotalScore: PropTypes.number,
  notes: PropTypes.array,
  allCriteria: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
  const { awardInfo: {
    body: {
      criteria = {},
      assessment_count = 0,
      avg_total_score = 0,
      notes = [],
    } = {},
    partner_decision_date,
    partner_notified,
  } = {},
  } = ownProps;
  const criteriaMap = R.toPairs(criteria);
  return {
    allCriteria: state.selectionCriteria,
    notifDate: partner_notified,
    acceptedDate: partner_decision_date,
    criteriaMap,
    assessmentCount: assessment_count,
    avgTotalScore: +avg_total_score.toFixed(2),
    notes,
  };
};

export default connect(
  mapStateToProps)(withStyles(styleSheet)(ExpandedAssessment));
