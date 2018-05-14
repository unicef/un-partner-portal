import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import { errorToBeCleared } from '../../reducers/errorReducer';
import { selectAllErrorsMapped } from '../../store';


const SnackbarContainer = (props) => {
  const { errors, children, clearError } = props;
  return (
    <div>
      {children}
      {errors.map((error, index) => (
        <Snackbar
          key={`snackbar_${error.id}_${index}`}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open
          message={error.userMessage}
          autoHideDuration={4e3 * ((errors.length - index))}
          onClose={() => { clearError(error.id); }}
        />))}
    </div>
  );
};


SnackbarContainer.propTypes = {
  children: PropTypes.node,
  errors: PropTypes.array,
  clearError: PropTypes.func,
};

const mapStateToProps = state => ({
  errors: selectAllErrorsMapped(state),
});

const mapDispatchToProps = dispatch => ({
  clearError: id => dispatch(errorToBeCleared(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SnackbarContainer);
