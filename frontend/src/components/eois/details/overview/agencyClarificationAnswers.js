import React, { Component } from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import FileUpload from 'material-ui-icons/FileUpload';
import Attachment from 'material-ui-icons/Attachment';
import Close from 'material-ui-icons/Close';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import { ROLES } from '../../../../helpers/constants';
import withMultipleDialogHandling from '../../../common/hoc/withMultipleDialogHandling';
import HeaderList from '../../../common/list/headerList';
import PaddedContent from '../../../common/paddedContent';
import { isCfeiClarificationDeadlinePassed, selectClarificationAnswersCount, selectClarificationAnswers, isUserAFocalPoint, isUserACreator } from '../../../../store';
import { checkPermission, AGENCY_PERMISSIONS, isRoleOffice, AGENCY_ROLES } from '../../../../helpers/permissions';
import Loader from '../../../common/loader';
import { loadClarificationAnswers } from '../../../../reducers/clarificationAnswers';
import AddClarificationAnswerModal from '../../modals/addClarificationAnswer/addClarificationAnswerModal';
import ButtonWithTooltip from '../../../common/buttonWithTooltipEnabled';
import DeleteClarificationAnswerModal from '../../modals/deleteClarificationAnswer/deleteClarificationAnswerModal';
import GridColumn from '../../../common/grid/gridColumn';

const messages = {
  partnerTitle: 'UN Response to Requests for Additional Information/Clarifications',
  title: 'Requests for additional \n Information/Clarifications',
  upload: 'Upload file',
  isCfeiDeadlinePassed: 'Upload will be enabled when clarification request deadline date has passed.',
  publishedUntil: 'UN Response will be available after Clarification Request Deadline date.',
  maxFile: 'You can upload up to three files.',
  noResponse: 'No response from UN',
};

const styleSheet = theme => ({
  root: {
    width: 0.1,
    height: 0.1,
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1,
  },
  button: {
    width: '100%',
  },
  iconLabel: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 72,
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.secondary[700],
    },
  },
  icon: {
    marginRight: theme.spacing.unit,
  },
  removeIcon: {
    fill: theme.palette.secondary[300],
  },
  link: {
    cursor: 'pointer',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  btnSize: {
    width: '100%',
  },
});

const upload = 'upload';
const remove = 'remove';

class AgencyClarificationAnswers extends Component {
  constructor(props) {
    super(props);

    this.uploadFile = this.uploadFile.bind(this);
    this.hasPermission = this.hasPermission.bind(this);
  }

  componentDidMount() {
    this.props.loadAnswers();
  }

  hasPermission(hasActionPermission) {
    const {
      isAdvEd,
      isPAM,
      isBasEd,
      isMFT,
      isCreator,
      isFocalPoint } = this.props;

    return ((hasActionPermission && isAdvEd && (isCreator || isFocalPoint))
      || (hasActionPermission && isBasEd && isCreator)
      || (hasActionPermission && isMFT && isFocalPoint)
      || (hasActionPermission && isPAM && isCreator));
  }

  fileItems() {
    const { classes, answers, dialogOpen, handleDialogClose, handleDialogOpen,
      id, hasPermissionToAdd, role } = this.props;

    return (answers.length > 0
      ? answers.map(item => (
        <React.Fragment key={item.id}>
          {dialogOpen[remove] && <DeleteClarificationAnswerModal
            cfeiId={id}
            id={item.id}
            dialogOpen={dialogOpen[remove]}
            handleDialogClose={handleDialogClose}
          />}
          <div key={item.id}>
            <Typography type="subheading" className={classes.iconLabel} gutterBottom >
              <Attachment className={classes.icon} />
              <div
                role="button"
                tabIndex={0}
                className={classes.link}
                onClick={() => { window.open(item.file); }}
              >
                {item.title}
              </div>
              {this.hasPermission(hasPermissionToAdd) && role === ROLES.AGENCY
                && <IconButton onClick={() => handleDialogOpen(remove)}>
                  <Close className={classes.removeIcon} />
                </IconButton>}
            </Typography>
          </div>
        </React.Fragment>)) 
      : <Typography type="body1">{messages.noResponse}</Typography>);
  }

  uploadFile() {
    const { classes, handleDialogOpen, isClarificationDeadlinePassed,
      count, hasPermissionToAdd } = this.props;
    const tooltipText = (!isClarificationDeadlinePassed && messages.isCfeiDeadlinePassed)
      || (count === 3 && messages.maxFile);

    return (
      (!isClarificationDeadlinePassed || count === 3) ?
        <ButtonWithTooltip
          name="publish"
          className={classes.btnSize}
          text={<div className={classes.iconLabel}>
            <FileUpload className={classes.icon} />
            {messages.upload}
          </div>}
          tooltipText={tooltipText}
          disabled
        />
        : this.hasPermission(hasPermissionToAdd) &&
        <Button
          className={classes.button}
          dense
          color="accent"
          onTouchTap={() => handleDialogOpen(upload)}
        >
          <div className={classes.iconLabel}>
            <FileUpload className={classes.icon} />
            {messages.upload}
          </div>
        </Button>);
  }

  render() {
    const { dialogOpen, handleDialogClose, loading, id,
      loadingAnswers, answers, role, isClarificationDeadlinePassed } = this.props;

    return (
      <React.Fragment>
        <Loader fullscreen loading={loading || loadingAnswers} />
        {dialogOpen[upload] && <AddClarificationAnswerModal
          id={id}
          dialogOpen={dialogOpen[upload]}
          handleDialogClose={handleDialogClose}
        />}
        <HeaderList
          header={<Typography style={{ margin: 'auto 0' }} type="body2">
            {role === ROLES.AGENCY ? messages.title : messages.partnerTitle}
          </Typography>}
        >
          <PaddedContent>
            <GridColumn spacing={8}>
              {role === ROLES.AGENCY
                ? !loadingAnswers && answers && this.fileItems()
                : isClarificationDeadlinePassed
                  ? this.fileItems()
                  : <Typography type="body1">{messages.publishedUntil}</Typography>}
            </GridColumn>
            {!loadingAnswers && !loading && role === ROLES.AGENCY && this.uploadFile()}
          </PaddedContent>
        </HeaderList>
      </React.Fragment>
    );
  }
}

AgencyClarificationAnswers.propTypes = {
  classes: PropTypes.object,
  dialogOpen: PropTypes.object,
  id: PropTypes.string,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  isClarificationDeadlinePassed: PropTypes.bool,
  hasPermissionToAdd: PropTypes.bool,
  loading: PropTypes.bool,
  loadingAnswers: PropTypes.bool,
  loadAnswers: PropTypes.func,
  answers: PropTypes.array,
  count: PropTypes.number,
  isAdvEd: PropTypes.bool,
  isMFT: PropTypes.bool,
  isPAM: PropTypes.bool,
  isBasEd: PropTypes.bool,
  isCreator: PropTypes.bool,
  isFocalPoint: PropTypes.bool,
  role: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  loading: state.addClarificationAnswer.status.loading,
  loadingAnswers: state.clarificationAnswers.status.loading,
  isClarificationDeadlinePassed: isCfeiClarificationDeadlinePassed(state, ownProps.id),
  hasPermissionToAdd:
    checkPermission(AGENCY_PERMISSIONS.CFEI_PUBLISHED_VIEW_AND_ANSWER_CLARIFICATION_QUESTIONS, state),
  count: selectClarificationAnswersCount(state, ownProps.id),
  answers: selectClarificationAnswers(state, ownProps.id),
  id: ownProps.id,
  isAdvEd: isRoleOffice(AGENCY_ROLES.EDITOR_ADVANCED, state),
  isMFT: isRoleOffice(AGENCY_ROLES.MFT_USER, state),
  isPAM: isRoleOffice(AGENCY_ROLES.PAM_USER, state),
  isBasEd: isRoleOffice(AGENCY_ROLES.EDITOR_BASIC, state),
  isCreator: isUserACreator(state, ownProps.id),
  isFocalPoint: isUserAFocalPoint(state, ownProps.id),
  role: state.session.role,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadAnswers: () => dispatch(loadClarificationAnswers(ownProps.id,
    { page: 1, page_size: 5 })),
});

export default R.compose(
  withStyles(styleSheet, { name: 'AgencyClarificationAnswers' }),
  withMultipleDialogHandling,
  connect(mapStateToProps, mapDispatchToProps),
)(AgencyClarificationAnswers);
