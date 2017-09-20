import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import { FormControl } from 'material-ui/Form';
import { renderCheckbox } from '../../helpers/formHelper';
import { required, warning } from '../../helpers/validation';

const styleSheet = createStyleSheet('mainLayout', theme => ({
  root: {
    display: 'flex',
     alignItems: 'center',
  // justify-content: center;
  },
}));


function TextFieldForm(props) {
  const {
    classes,
    fieldName,
    label,
    textFieldProps,
    optional,
    validation,
    warn,
    disabled,
    readOnly,
  } = props;
  return (
    <Grid item>
      <FormControl fullWidth>
        <div className={classes.root}>
          <Field
            name={fieldName}
            component={renderCheckbox}
            validate={optional ? [] : [required].concat(validation || [])}
            warn={warn && warning}
            {...textFieldProps}
          />
          <Typography color="inherit" type="caption">
            {label}
          </Typography>
        </div>
      </FormControl>
    </Grid>
  );
}


TextFieldForm.propTypes = {
  classes: PropTypes.object.isRequired,
  /**
   * Name of the field used by react-form and as unique id.
   */
  fieldName: PropTypes.string.isRequired,
  /**
   * label used in field, also placeholder is built from it by adding 'Provide'
   */
  label: PropTypes.string,
  /**
   * props passed to wrapped TextField
   */
  textFieldProps: PropTypes.node,
  /**
   * unique text used as placeholder
   */
  placeholder: PropTypes.string,
  /**
   * if field is optional
   */
  optional: PropTypes.bool,
  /**
   * validations passed to field
   */
  validation: PropTypes.arrayOf(PropTypes.func),
  /**
   * validations passed to field
   */
  warn: PropTypes.bool,
  /**
   * if form should be displayed in read only state
   */
  readOnly: PropTypes.bool,
};

TextFieldForm.defaultProps = {
  placeholder: null,
};


export default withStyles(styleSheet)(TextFieldForm);
