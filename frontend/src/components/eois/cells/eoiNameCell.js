import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, browserHistory as history } from 'react-router';
import Typography from 'material-ui/Typography';
import TableCell from './tableCell';

const onClick = id => () => {
  const loc = history.getCurrentLocation().pathname;
  history.push(`${loc}/${id}`);
};

const EoiNameCell = (props) => {
  const { title, id } = props;

  return (
    <TableCell first limited onClick={onClick(id)}>
      <Typography color="accent">
        {title}
      </Typography>
    </TableCell>
  );
};

EoiNameCell.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export default withRouter(EoiNameCell);
