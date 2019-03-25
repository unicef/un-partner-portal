import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { deactivateUser } from '../../reducers/deactivateUser';
import DropdownMenu from '../../../components/common/dropdownMenu';
import DeactivateUserButton from './deactivateUserButton';
import Loader from '../../../components/common/loader';

const MoreUserButton = (props) => {
  const { id, deactivate, isActive, loading, ...other } = props;
  return (
    <div>
      <DropdownMenu
        options={
          [
            {
              name: 'deactivateItem',
              content: <DeactivateUserButton isActive={isActive} handleClick={() => deactivate(id, isActive)} />,
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
  isActive: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  loading: state.idPortalDeactivateUser.status.loading,
});

const mapDispatch = dispatch => ({
  deactivate: (id, isActive) => dispatch(deactivateUser(id, isActive)),
});

const connectedUMoreUserButton = connect(mapStateToProps, mapDispatch)(MoreUserButton);
export default withRouter(connectedUMoreUserButton);
