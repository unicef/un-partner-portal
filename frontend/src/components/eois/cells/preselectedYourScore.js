
import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import Tooltip from '../../common/tooltip';
import SpreadContent from '../../common/spreadContent';
import TooltipText from '../../common/text/tooltipText';

const renderExpandedCell = data => data.map((score, index) => (
  <SpreadContent key={index}>
    <TooltipText color="inherit" align="left">
      {score.label}
    </TooltipText>
    <div style={{ minWidth: 50 }} />
    <TooltipText color="inherit" align="right">
      {score.score}
    </TooltipText>
  </SpreadContent>
));

const ApplicationStatusCell = (props) => {
  const { id, score } = props;
  const localScore = (score && score.total) || '-';
  return (
    <TableCell data-tip data-for={`${id}-your-score-tooltip`}>
      {localScore}
      {score && score.breakdown && <Tooltip
        id={`${id}-your-score-tooltip`}
        text={renderExpandedCell(score.breakdown)}
      />}
    </TableCell>
  );
};

ApplicationStatusCell.propTypes = {
  id: PropTypes.string,
  score: PropTypes.string,
};

export default ApplicationStatusCell;
