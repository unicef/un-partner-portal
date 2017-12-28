import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router';
import Typography from 'material-ui/Typography';
import { TableCell } from 'material-ui/Table';

const types = [
  { type: 'Open Selection', path: 'open' },
  { type: 'Unsolicited Concept Note', path: 'unsolicited' },
  { type: 'Direct Selection', path: 'direct' },
];

const pathType = type => R.filter(item => item.type === type, types);

const path = (type, eoiId) => {
  const source = pathType(type)[0];

  if (source.path === 'open') {
    return `/cfei/open/${eoiId}/overview`;
  } else if (source.path === 'direct') {
    return `/cfei/direct/${eoiId}/overview`;
  } else if (source.path === 'unsolicited') {
    return `/cfei/unsolicited/${eoiId}/overview`;
  }
};

const TitleCell = (props) => {
  const { title, eoiId, type } = props;

  return (
    <TableCell>
      <Typography
        component={Link}
        color="accent"
        to={path(type, eoiId)}
      >
        {title}
      </Typography>
    </TableCell>
  );
};

TitleCell.propTypes = {
  eoiId: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
};

export default withRouter(TitleCell);
