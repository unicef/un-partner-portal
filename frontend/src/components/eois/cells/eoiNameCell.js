import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router';
import Typography from 'material-ui/Typography';
import { TableCell } from 'material-ui/Table';
import { PROJECT_TYPES } from '../../../helpers/constants';

const EoiNameCell = (props) => {
  const { title, id, params: { type } } = props;
  const typeTo = type === PROJECT_TYPES.PINNED ? PROJECT_TYPES.OPEN : type;
  return (
    <TableCell first limited>
      <Typography
        component={Link}
        color="accent"
        to={`/cfei/${typeTo}/${id}`}
      >
        {title}
      </Typography>
    </TableCell>
  );
};

EoiNameCell.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string,
  params: PropTypes.object,
};

export default withRouter(EoiNameCell);
