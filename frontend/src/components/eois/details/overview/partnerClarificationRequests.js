import React, { Component } from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import withMultipleDialogHandling from '../../../common/hoc/withMultipleDialogHandling';
import HeaderList from '../../../common/list/headerList';
import DropdownMenu from '../../../common/dropdownMenu';
import AddNewRequestButton from '../../buttons/addNewRequestButton';
import PaddedContent from '../../../common/paddedContent';
import AddClarificationRequestModal from '../../modals/addClarificationRequest/addClarificationRequestModal';
import { selectClarificationRequestsCount, isCfeiClarificationDeadlinePassed } from '../../../../store';
import SpreadContent from '../../../common/spreadContent';
import { checkPermission, PARTNER_PERMISSIONS } from '../../../../helpers/permissions';
import Loader from '../../../common/loader';
import { loadClarificationRequests } from '../../../../reducers/clarificationRequests';
import ClarificationRequestModal from '../../modals/clarificationRequests/clarificationRequestModal';

const messages = {
  title: 'Requests for additional \n Information/Clarifications',
  requests: 'Request(s)',
  viewDetails: 'view details',
};

const add = 'add';
const preview = 'preview';

class PartnerClarificationRequests extends Component {
  constructor(props) {
    super(props);

    this.title = this.title.bind(this);
  }

  componentDidMount() {
    this.props.loadRequests();
  }

  title() {
    const { handleDialogOpen, hasPermissionToAdd, isClaraificationDeadlinePassed } = this.props;

    return (<SpreadContent>
      <Typography type="body2" >{messages.title}</Typography>
      {hasPermissionToAdd && !isClaraificationDeadlinePassed && <DropdownMenu
        options={[
          {
            name: add,
            content: <AddNewRequestButton handleClick={() => handleDialogOpen(add)} />,
          },
        ]}
      />}
    </SpreadContent>);
  }

  render() {
    const { dialogOpen, handleDialogClose, loading, id, handleDialogOpen, count } = this.props;

    return (
      <React.Fragment>
        <Loader fullscreen loading={loading} />
        {dialogOpen[add] && <AddClarificationRequestModal
          id={id}
          dialogOpen={dialogOpen[add]}
          handleDialogClose={handleDialogClose}
        />}
        {dialogOpen[preview] && <ClarificationRequestModal
          id={id}
          dialogOpen={dialogOpen[preview]}
          handleDialogClose={handleDialogClose}
        />}
        <HeaderList
          header={this.title}
        >
          <PaddedContent>
            <SpreadContent>
              <Typography>{`${count || 0} ${messages.requests}`}</Typography>
              <Button color="accent" onTouchTap={() => handleDialogOpen(preview)}>{messages.viewDetails}</Button>
            </SpreadContent>
          </PaddedContent>
        </HeaderList>
      </React.Fragment>
    );
  }
}

PartnerClarificationRequests.propTypes = {
  dialogOpen: PropTypes.object,
  id: PropTypes.string,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  isClaraificationDeadlinePassed: PropTypes.bool,
  hasPermissionToAdd: PropTypes.bool,
  loading: PropTypes.bool,
  loadRequests: PropTypes.func,
  count: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  loading: state.addClarificationRequest.status.loading,
  isClaraificationDeadlinePassed: isCfeiClarificationDeadlinePassed(state, ownProps.id),
  hasPermissionToAdd: checkPermission(PARTNER_PERMISSIONS.CFEI_SEND_CLARIFICATION_REQUEST, state),
  count: selectClarificationRequestsCount(state, ownProps.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadRequests: () => dispatch(loadClarificationRequests(ownProps.id,
    { page: 1, page_size: 5 })),
});

export default R.compose(
  withMultipleDialogHandling,
  connect(mapStateToProps, mapDispatchToProps),
)(PartnerClarificationRequests);
