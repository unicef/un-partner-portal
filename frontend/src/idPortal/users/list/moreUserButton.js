import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { deactivateUser } from '../../reducers/deactivateUser';
import DropdownMenu from '../../../components/common/dropdownMenu';
import DeactivateUserButton from './deactivateUserButton';
import Loader from '../../../components/common/loader';

const MoreUserButton = (props) => {
  const { id, deactivate, loading, ...other } = props;
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
      <Loader loading={loading} fullscreen />
    </div>
  );
};

MoreUserButton.propTypes = {
  id: PropTypes.number,
  deactivate: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  loading: state.idPortalDeactivateUser.status.loading,
});

const mapDispatch = dispatch => ({
  deactivate: id => dispatch(deactivateUser(id)),
});

const connectedUMoreUserButton = connect(mapStateToProps, mapDispatch)(MoreUserButton);
export default withRouter(connectedUMoreUserButton);
