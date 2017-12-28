import Typography from 'material-ui/Typography';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import DeleteButton from '../buttons/removePreselection';
import GetConceptNoteButton from '../buttons/getConceptNoteButton';
import GridRow from '../../common/grid/gridRow';
import WithGreyColor from '../../common/hoc/withGreyButtonStyle';

const PreselectedTotalScore = (props) => {
  const { id, conceptNote, score, hovered, allowedToEdit } = props;
  const Delete = WithGreyColor()(DeleteButton);
  const Download = WithGreyColor(!conceptNote)(GetConceptNoteButton);
  const localScore = score ? score.toFixed(2) : '-';

  return (
    <TableCell>
      <GridRow alignItems="center" >
        <Typography type="body1" color="inherit">
          {localScore}
        </Typography>
        {hovered && <GridRow spacing={8} columns={2}>
          <Download id={id} conceptNote={conceptNote} />
          {allowedToEdit && <Delete id={[id]} />}
        </GridRow>}
      </GridRow>
    </TableCell>
  );
};

PreselectedTotalScore.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  conceptNote: PropTypes.string,
  score: PropTypes.number,
  hovered: PropTypes.bool,
  allowedToEdit: PropTypes.bool,
};

export default PreselectedTotalScore;
