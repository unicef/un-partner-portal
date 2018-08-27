import R from 'ramda';
import Button from 'material-ui/Button';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import red from 'material-ui/colors/red';
import ClassName from 'classnames';
import { browserHistory as history, withRouter } from 'react-router';
import PropTypes from 'prop-types';
import DeleteButton from '../buttons/removePreselection';
import GetConceptNoteButton from '../buttons/getConceptNoteButton';
import GridRow from '../../common/grid/gridRow';
import WithGreyColor from '../../common/hoc/withGreyButtonStyle';
import { changeAppStatus } from '../../../reducers/partnersApplicationsList';
import { APPLICATION_STATUSES } from '../../../helpers/constants';
import { loadCfei } from '../../../reducers/cfeiDetails';
import { isSendForDecision, isUserACreator } from '../../../store';
import ButtonWithTooltip from '../../common/buttonWithTooltipEnabled';

const messages = {
  recommend: 'recommend ',
  unrecommend: 'unrecommend',
  finishReviews: 'All assessments must be finished before recommending partner.',
  send: 'Recommendation(s) already send for decision',
  selected: 'Recommendation selected',
  retracted: 'Recommendation retracted',
  accepted: 'Partner accepted',
  declined: 'Partner declined',
};

const styleSheet = theme => ({
  divider: {
    background: theme.palette.grey[400],
  },
  unrecommend: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  },
});

const RecommendPartnerCell = (props) => {
  const { classes, id, conceptNote, hovered, changeStatus,
    allowedToEdit, finishedReviews, loadCfeiDetails,
    status, isUserCreator, isSend, didWin, retracted,
    didAccept, didDecline } = props;
  const Delete = WithGreyColor()(DeleteButton);
  const Download = WithGreyColor(!conceptNote)(GetConceptNoteButton);
  const buttonClass = ClassName(
    { [classes.unrecommend]: status === APPLICATION_STATUSES.REC },
  );
console.log(didAccept);
  const tooltip = (!finishedReviews && messages.finishReviews)
   || ((isUserCreator && isSend) && messages.send)
   || (didAccept && messages.accepted)
   || (didDecline && messages.declined)
   || ((didWin && !retracted) && messages.selected)
   || (retracted && messages.retracted);

  const buttonText = status === APPLICATION_STATUSES.REC ?
    messages.unrecommend : messages.recommend;

  return (
    <TableCell>
      <GridRow alignItems="center" >
        {(!finishedReviews || (isUserCreator && isSend) || didWin || retracted)
          ? <ButtonWithTooltip
            name="send"
            disabled
            text={buttonText}
            tooltipText={tooltip}
          />
          : <Button
            className={buttonClass}
            onClick={(event) => {
              event.stopPropagation();
              changeStatus([id], status === APPLICATION_STATUSES.REC ? APPLICATION_STATUSES.PRE : APPLICATION_STATUSES.REC).then(() => {
                loadCfeiDetails(props.params.id).then(() => {
                  if (status === APPLICATION_STATUSES.PRE) {
                    history.push(`/cfei/open/${props.params.id}/results`);
                  } else {
                    history.push(R.assoc('hash', null, history.getCurrentLocation()));
                  }
                });
              });
            }}
            color="accent"
            raised
          >{buttonText}
          </Button>}
        {hovered && <GridRow spacing={8} columns={2}>
          <Download id={id} conceptNote={conceptNote} />
          {allowedToEdit && <Delete id={[id]} />}
        </GridRow>}
      </GridRow>
    </TableCell>
  );
};

RecommendPartnerCell.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  conceptNote: PropTypes.string,
  status: PropTypes.string,
  hovered: PropTypes.bool,
  finishedReviews: PropTypes.bool,
  allowedToEdit: PropTypes.bool,
  changeStatus: PropTypes.func,
  loadCfeiDetails: PropTypes.func,
  isSend: PropTypes.bool,
  isUserCreator: PropTypes.bool,
  didWin: PropTypes.bool,
  didAccept: PropTypes.bool,
  didDecline: PropTypes.bool,
  retracted: PropTypes.bool,
};

const withStyle = withStyles(styleSheet, { name: 'RecommendPartnerCell' })(RecommendPartnerCell);

const connected = connect((state, ownProps) => ({
  isSend: isSendForDecision(state, ownProps.params.id),
  isUserCreator: isUserACreator(state, ownProps.params.id),
}),
dispatch => ({
  loadCfeiDetails: id => dispatch(loadCfei(id)),
  changeStatus: (id, status) => dispatch(changeAppStatus(id, status)) }),
)(withStyle);

export default withRouter(connected);
