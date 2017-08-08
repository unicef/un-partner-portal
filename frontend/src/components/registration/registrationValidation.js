
const validate = (values) => {
  const errors = {};
  if (!values.organizationType) {
    errors.organizationType = 'Required';
  }
  if (values.organizationType === 'ingo' && !values.office) {
    errors.office = 'Required';
  }
  if (!values.legalNameChange) {
    errors.legalNameChange = 'Required';
  }
  if (!values.country) {
    errors.country = 'Required';
  }
  return errors;
};

export default validate;
