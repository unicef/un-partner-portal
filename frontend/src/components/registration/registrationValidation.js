
const validate = (values) => {
  const errors = {};
  if (!values.organizationType) {
    errors.organizationType = 'Required';
  }

  if (!values.legalNameChange) {
    errors.legalNameChange = 'Required';
  }
  if (!values.country) {
    errors.country = 'Required';
  }

  if (!values.legalName) {
    errors.legalName = 'Required';
  }

  if (!values.legalNameChange) {
    errors.legalNameChange = 'Required';
  }

  if (!values.headFirstName) {
    errors.headFirstName = 'Required';
  }

  if (!values.headLastName) {
    errors.headLastName = 'Required';
  }

  if (!values.headEmail) {
    errors.headEmail = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.headEmail)) {
    errors.headEmail = 'Invalid email address';
  }

  if (values.organizationType === 'ingo' && !values.office) {
    errors.office = 'Required';
  }

  if (values.legalNameChange === 'yes' && !values.formerLegalName) {
    errors.formerLegalName = 'Required';
  }
  return errors;
};

export default validate;
