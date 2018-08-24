import R from 'ramda';
import Button from 'material-ui/Button';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import DeleteButton from '../buttons/removePreselection';
import GetConceptNoteButton from '../buttons/getConceptNoteButton';
import GridRow from '../../common/grid/gridRow';
import WithGreyColor from '../../common/hoc/withGreyButtonStyle';
import withApplicationStatusChange from '../../common/hoc/withApplicationStatusChange';
import { APPLICATION_STATUSES } from '../../../helpers/constants';

const messages = {
  recommend: 'recommend',
};

const styleSheet = theme => ({
  divider: {
    background: theme.palette.grey[400],
  },
});

const RecommendPartnerCell = (props) => {
  const { id, conceptNote, status, hovered, changeStatus, allowedToEdit, finishedReviews } = props;
  const Delete = WithGreyColor()(DeleteButton);
  const Download = WithGreyColor(!conceptNote)(GetConceptNoteButton);

  return (
    <TableCell>
      <GridRow alignItems="center" >
        <Button
          onClick={(event) => {
            event.stopPropagation();
            changeStatus([id]);
          }}
          color="accent"
          disabled={!finishedReviews}
          raised
        >{messages.recommend}</Button>
        {hovered && <GridRow spacing={8} columns={2}>
          <Download id={id} conceptNote={conceptNote} />
          {allowedToEdit && <Delete id={[id]} />}
        </GridRow>}
      </GridRow>
    </TableCell>
  );
};

RecommendPartnerCell.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  conceptNote: PropTypes.string,
  hovered: PropTypes.bool,
  finishedReviews: PropTypes.bool,
  allowedToEdit: PropTypes.bool,
  status: PropTypes.string,
  changeStatus: PropTypes.func,
};

const withStyle = withStyles(styleSheet, { name: 'RecommendPartnerCell' })(RecommendPartnerCell);

export default withApplicationStatusChange(APPLICATION_STATUSES.REC)(withStyle);
