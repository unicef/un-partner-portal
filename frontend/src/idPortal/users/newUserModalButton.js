import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import { ROLES } from '../../helpers/constants';
import NewUserModalPartner from './partner/newUserModal';
import NewUserModalAgency from './agency/newUserModal';
import withDialogHandling from '../../components/common/hoc/withDialogHandling';

const messages = {
  user: 'New user',
};

const NewUserModalButton = (props) => {
  const { handleDialogClose, handleDialogOpen, dialogOpen, role } = props;
  return (
    <React.Fragment>
      <Button
        raised
        color="accent"
        onClick={handleDialogOpen}
      >
        {messages.user}
      </Button>
      {role === ROLES.PARTNER
        ? <NewUserModalPartner open={dialogOpen} onDialogClose={handleDialogClose} />
        : <NewUserModalAgency open={dialogOpen} onDialogClose={handleDialogClose} />
      }
    </React.Fragment>
  );
};

NewUserModalButton.propTypes = {
  role: PropTypes.string,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};

const mapStateToProps = state => ({
  role: state.session.role,
});

export default compose(
  withDialogHandling,
  connect(mapStateToProps),
  withRouter)(NewUserModalButton);
