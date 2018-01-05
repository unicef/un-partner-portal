import Typography from 'material-ui/Typography';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import { Link } from 'react-router';


const ConceptNoteIDCell = (props) => {
  const { id, cfeiId, type } = props;
  return (
    <TableCell>
      <Typography
        component={Link}
        color="accent"
        type="body2"
        to={`/cfei/${type}/${cfeiId}`}
      >
        {id}
      </Typography>
    </TableCell>
  );
};

ConceptNoteIDCell.propTypes = {
  id: PropTypes.number,
  cfeiId: PropTypes.string,
};

export default ConceptNoteIDCell;
