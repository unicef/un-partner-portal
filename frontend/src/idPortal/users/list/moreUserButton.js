import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { deactivateUser } from '../../reducers/newUser';
import DropdownMenu from '../../../components/common/dropdownMenu';
import DeactivateUserButton from './deactivateUserButton';
import Loader from '../../../components/common/loader';

const MoreUserButton = (props) => {
  const { id, deactivate, ...other } = props;
  return (
    <div>
      <DropdownMenu
        options={
          [
            {
              name: 'deactivateItem',
              content: <DeactivateUserButton handleClick={() => deactivate(id)} />,
            },
          ]
        }
      />
      <Loader loading={false} fullscreen />
    </div>
  );
};

MoreUserButton.propTypes = {
  id: PropTypes.number,
  deactivate: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  loading: state.idPortalUsersList.loading,
});

const mapDispatch = dispatch => ({
  deactivate: id => dispatch(deactivateUser(id)),
});

const connectedUMoreUserButton = connect(null, mapDispatch)(MoreUserButton);
export default withRouter(connectedUMoreUserButton);
