import R from 'ramda';
import Typography from 'material-ui/Typography';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import DeleteButton from '../buttons/removePreselection';
import GetConceptNoteButton from '../buttons/getConceptNoteButton';
import GridRow from '../../common/grid/gridRow';
import WithGreyColor from '../../common/hoc/withGreyButtonStyle';
import Tooltip from '../../common/portalTooltip';
import SpreadContent from '../../common/spreadContent';

const styleSheet = theme => ({
  divider: {
    background: theme.palette.grey[400],
  },
});

const renderExpandedCell = (classes, assessments) =>
  R.map((item, index) => (<div key={index}><SpreadContent>
    {item.reviewer_fullname}
    <div style={{ minWidth: 50 }} />
    {item.total_score}
  </SpreadContent><Divider className={classes.divider} /></div>),
  assessments);

const PreselectedTotalScore = (props) => {
  const { classes, id, conceptNote, score, hovered, allowedToEdit, assessments } = props;
  const Delete = WithGreyColor()(DeleteButton);
  const Download = WithGreyColor(!conceptNote)(GetConceptNoteButton);
  const localScore = score ? score.toFixed(2) : '-';

  return (
    <TableCell>
      <GridRow alignItems="center" >
        <Tooltip
          id={`${id}-your-score-tooltip`}
          title={renderExpandedCell(classes, assessments)}
        >
          <Typography type="body1" color="inherit">
            {localScore}
          </Typography>
        </Tooltip>
        {hovered && <GridRow spacing={8} columns={2}>
          <Download id={id} conceptNote={conceptNote} />
          {allowedToEdit && <Delete id={[id]} />}
        </GridRow>}
      </GridRow>
    </TableCell>
  );
};

PreselectedTotalScore.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  conceptNote: PropTypes.string,
  assessments: PropTypes.array,
  score: PropTypes.number,
  hovered: PropTypes.bool,
  allowedToEdit: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'PreselectedTotalScore' })(PreselectedTotalScore);
