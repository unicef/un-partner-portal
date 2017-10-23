import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, browserHistory as history, Link } from 'react-router';
import Typography from 'material-ui/Typography';
import { TableCell } from 'material-ui/Table';

const EoiNameCell = (props) => {
  const { title, id, params: { type } } = props;

  return (
    <TableCell first limited>
      <Typography
        component={Link}
        color="accent"
        to={`/cfei/${type}/${id}`}
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
