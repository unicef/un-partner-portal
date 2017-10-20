import Typography from 'material-ui/Typography';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';

const ConceptNoteIDCell = (props) => {
  const { id } = props;

  return (
    <TableCell>
      <Typography color="accent" type="body2">{id}</Typography>
    </TableCell>
  );
};

ConceptNoteIDCell.propTypes = {
  id: PropTypes.object.isRequired,
};

export default ConceptNoteIDCell;
