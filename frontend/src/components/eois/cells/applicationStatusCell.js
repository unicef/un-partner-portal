import Typography from 'material-ui/Typography';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import RejectButton from '../buttons/rejectButton';
import PreselectButton from '../buttons/preselectButton';
import GetConceptNoteButton from '../buttons/getConceptNoteButton';
import GridRow from '../../common/grid/gridRow';
import WithGreyColor from '../../common/hoc/withGreyButtonStyle';
import { APPLICATION_STATUSES } from '../../../helpers/constants';

const statuses = {
  Pre: 'Preselected',
  Rej: 'Rejected',
  Pen: 'Pending',
};

const ApplicationStatusCell = (props) => {
  const { id, conceptNote, status, hovered } = props;
  const Preselect = WithGreyColor(status === APPLICATION_STATUSES.PRE)(PreselectButton);
  const Reject = WithGreyColor(status === APPLICATION_STATUSES.REJ)(RejectButton);
  const Download = WithGreyColor(!conceptNote)(GetConceptNoteButton);
  return (
    <TableCell>
      <GridRow align="center" >
        <Typography type="body1" color="inherit">
          {statuses[status]}
        </Typography>
        {hovered && <GridRow gutter={0} columns={3}>
          <Download id={id} conceptNote={conceptNote} />
          <Preselect id={[id]} status={status} />
          <Reject id={[id]} status={status} />
        </GridRow>}
      </GridRow >
    </TableCell>
  );
};

ApplicationStatusCell.propTypes = {
  id: PropTypes.string,
  conceptNote: PropTypes.string,
  status: PropTypes.string,
  hovered: PropTypes.bool,
};

export default ApplicationStatusCell;
