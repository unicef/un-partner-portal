import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router';
import Typography from 'material-ui/Typography';
import { TableCell } from 'material-ui/Table';

const types = [
  { type: 'Open Selection', path: 'open' },
  { type: 'Unsolicited Concept Note', path: 'unsolicited' },
  { type: 'Direct Selection/Retention', path: 'direct' },
];

const pathType = type => R.filter(item => item.type === type, types);

const path = (type, cnId, eoiId) => {
  const source = pathType(type)[0];

  if (source.path === 'open') {
    return `/cfei/open/${eoiId}/applications/${cnId}`;
  } else if (source.path === 'direct') {
    return `/cfei/direct/${cnId}`;
  } else if (source.path === 'unsolicited') {
    return `/cfei/unsolicited/${cnId}/overview`;
  }
};

const CnCell = (props) => {
  const { cnId, eoiId, type } = props;

  return (
    <TableCell>
      <Typography
        component={Link}
        color="accent"
        to={path(type, cnId, eoiId)}
      >
        {cnId}
      </Typography>
    </TableCell>
  );
};

CnCell.propTypes = {
  eoiId: PropTypes.string,
  cnId: PropTypes.string,
  type: PropTypes.string,
};

export default withRouter(CnCell);
