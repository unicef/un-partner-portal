import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import RejectButton from '../buttons/rejectButton';
import PreselectButton from '../buttons/preselectButton';
import GetConceptNoteButton from '../buttons/getConceptNoteButton';
import GridRow from '../../common/grid/gridRow';
import WithGreyColor from '../../common/hoc/withGreyButtonStyle';
import { APPLICATION_STATUSES } from '../../../helpers/constants';
import ApplicationStatusText from '../details/applications/applicationStatusText';

const ApplicationStatusCell = (props) => {
  const { id, conceptNote, status, applicationStatus, hovered, progress } = props;
  const Preselect = WithGreyColor(status === APPLICATION_STATUSES.PRE)(PreselectButton);
  const Reject = WithGreyColor(!progress.startsWith('0')
    || status === APPLICATION_STATUSES.REJ)(RejectButton);
  const Download = WithGreyColor(!conceptNote)(GetConceptNoteButton);
  return (
    <TableCell>
      <GridRow alignItems="center" >
        <ApplicationStatusText status={status} applicationStatus={applicationStatus} />
        {hovered && <GridRow spacing={8} columns={3}>
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
  progress: PropTypes.string,
  applicationStatus: PropTypes.string,
};

ApplicationStatusCell.defaultProps = {
  progress: '',
};

export default ApplicationStatusCell;
