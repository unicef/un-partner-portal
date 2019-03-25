import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import TextFieldForm from '../../../../../forms/textFieldForm';
import GridColumn from '../../../../../common/grid/gridColumn';
import { selectNormalizedBusinessAreas } from '../../../../../../store';

const messages = {
  vendorNumber: 'Vendor number', 
};

const AddVendorNumberForm = (props) => {
  const { handleSubmit, readOnly } = props;

  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <TextFieldForm
          label={messages.vendorNumber}
          fieldName="number"
          readOnly={readOnly}
          required
        /> 
      </GridColumn>
    </form >
  );
};

AddVendorNumberForm.propTypes = {
  /**
     * callback for form submit
     */
  handleSubmit: PropTypes.func.isRequired,
  businessArea: PropTypes.array,
  readOnly: PropTypes.bool,
};

const formAddVendorNumber = reduxForm({
  form: 'addVendorNumberForm',
})(AddVendorNumberForm);


const mapStateToProps = state => ({
  businessArea: selectNormalizedBusinessAreas(state),
});

export default connect(mapStateToProps, null)(formAddVendorNumber);
