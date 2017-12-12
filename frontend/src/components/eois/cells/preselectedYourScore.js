
import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import Tooltip from '../../common/tooltip';
import SpreadContent from '../../common/spreadContent';
import TooltipText from '../../common/text/tooltipText';

const renderExpandedCell = data => data.map((score, index) => (
  <SpreadContent key={index}>
    <TooltipText color="inherit" alignItems="left">
      {score.label}
    </TooltipText>
    <div style={{ minWidth: 50 }} />
    <TooltipText color="inherit" alignItems="right">
      {score.score}
    </TooltipText>
  </SpreadContent>
));

const PreselectedYourScore = (props) => {
  const { id, score, breakdown } = props;
  const localScore = (score && score) || '-';
  return (
    <TableCell data-tip data-for={`${id}-your-score-tooltip`}>
      {localScore}
      {score && score.breakdown && <Tooltip
        id={`${id}-your-score-tooltip`}
        text={renderExpandedCell(breakdown)}
      />}
    </TableCell>
  );
};

PreselectedYourScore.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  score: PropTypes.number,
};

export default PreselectedYourScore;
