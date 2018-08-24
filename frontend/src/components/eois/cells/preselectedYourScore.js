
import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import Tooltip from '../../common/portalTooltip';
import SpreadContent from '../../common/spreadContent';

const renderExpandedCell = (data, allCriteria) =>
  R.map(([key, review], index) => (<SpreadContent key={index}>
    {allCriteria[key]}
    <div style={{ minWidth: 50 }} />
    {review.score}
  </SpreadContent>), data);

const PreselectedYourScore = (props) => {
  const { id, score, breakdown, allCriteria } = props;
  const localScore = (score && score) || '-';
  return (
    <TableCell>
      <Tooltip
        id={`${id}-your-score-tooltip`}
        title={renderExpandedCell(R.toPairs(breakdown) || [], allCriteria)}
        disabled={score && score.breakdown}
      >
        <div>{localScore}</div>
      </Tooltip>
    </TableCell>
  );
};

PreselectedYourScore.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  score: PropTypes.number,
  breakdown: PropTypes.object,
  allCriteria: PropTypes.object,
};

const mapStateToProps = state => ({
  allCriteria: state.selectionCriteria,
});

export default connect(mapStateToProps)(PreselectedYourScore);
