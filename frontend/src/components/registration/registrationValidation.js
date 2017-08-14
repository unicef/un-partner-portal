
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

  if (!values.userFirstName) {
    errors.userFirstName = 'Required';
  }

  if (!values.userLastName) {
    errors.userLastName = 'Required';
  }

  if (!values.userPosition) {
    errors.userPosition = 'Required';
  }

  if (!values.userPassword) {
    errors.userPassword = 'Required';
  } else if (
    /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*|[^\s]*\s.*)$/.test(
      values.userPassword)) {
    errors.userPassword = 'Password is not in correct format';
  }

  if (!values.userEmail) {
    errors.userEmail = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.userEmail)) {
    errors.userEmail = 'Invalid email address';
  }

  if (!values.headEmail) {
    errors.headEmail = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.headEmail)) {
    errors.headEmail = 'Invalid email address';
  }

  errors.questions = [];
  for (let i = 0; i < 5; i += 1) {
    if (!values.questions || values.questions[i] === (null || undefined)) {
      errors.questions[i] = 'Required';
    }
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
