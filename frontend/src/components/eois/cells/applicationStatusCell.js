import Typography from 'material-ui/Typography';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import RejectButton from '../buttons/rejectButton';
import PreselectButton from '../buttons/preselectButton';
import GetConceptNoteButton from '../buttons/getConceptNoteButton';
import GridRow from '../../common/grid/gridRow';
import WithGreyColor from '../../common/hoc/withGreyButtonStyle';

const statuses = {
  Pre: 'Preselected',
  Rej: 'Rejected',
  Pen: 'Pending',
};

const ApplicationStatusCell = (props) => {
  const { id, conceptNoteId, status, hovered } = props;
  const Preselect = WithGreyColor(PreselectButton);
  const Reject = WithGreyColor(RejectButton);
  const Download = WithGreyColor(GetConceptNoteButton);
  return (
    <TableCell>
      <GridRow align="center" >
        <Typography type="body1" color="inherit">
          {statuses[status]}
        </Typography>
        {hovered && <GridRow gutter={0} columns={3}>
          <Download id={conceptNoteId} />
          <Preselect id={[id]} />
          <Reject id={[id]} />
        </GridRow>}
      </GridRow >
    </TableCell>
  );
};

ApplicationStatusCell.propTypes = {
  id: PropTypes.string,
  conceptNoteId: PropTypes.string,
  status: PropTypes.string,
  hovered: PropTypes.bool,
};

export default ApplicationStatusCell;
