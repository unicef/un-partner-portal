import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router';
import Typography from 'material-ui/Typography';
import { TableCell } from 'material-ui/Table';

const types = [
  { type: 'Open Selection', path: 'open' },
  { type: 'Unsolicited Concept Note', path: 'unsolicited' },
  { type: 'Direct Selection / Retention', path: 'direct' },
];

const pathType = type => R.filter(item => item.type === type, types);

const path = (type, eoiId, cnId) => {
  // debugger
  const source = pathType(type)[0];
  if (source.path === 'open') {
    return `/cfei/open/${eoiId}/`;
  } else if (source.path === 'direct') {
    return `/cfei/direct/${eoiId}`;
  } else if (source.path === 'unsolicited') {
    return `/cfei/unsolicited/${cnId}`;
  }
};

const CnCell = (props) => {
  const { eoiId, cnId, type } = props;
  return (
    <TableCell>
      <Typography
        component={Link}
        color="accent"
        to={path(type, eoiId, cnId)}
      >
        {cnId}
      </Typography>
    </TableCell>
  );
};

CnCell.propTypes = {
  eoiId: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number]),
  cnId: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
};

export default withRouter(CnCell);
