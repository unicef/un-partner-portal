import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { FormControl } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import FileFormUploadButton from '../common/buttons/fileFormUploadButton';
import { renderFileDownload } from '../../helpers/formHelper';
import { required, warning } from '../../helpers/validation';

class FileForm extends Component {
  constructor(props) {
    super(props);
    this.state = { fileAdded: false };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.setState({ fileAdded: true });
  }

  renderFileName(fieldName) {
    const file = document.getElementById(`${fieldName}-input`).files[0];
    if (file) return file.name;
    this.setState({ fileAdded: false });
    return '';
  }

  render() {
    const { fieldName, label, optional, formName, sectionName,
      validation, warn, readOnly, deleteDisabled, ...other } = this.props;

    return (
      <Grid item>
        <FormControl fullWidth>
          {readOnly
            ? [
              <Field
                name={fieldName}
                label={label}
                component={renderFileDownload(this.props)}
                optional={optional}
              />]
            :
            <div>
              <Field
                name={fieldName}
                component={FileFormUploadButton}
                fieldName={fieldName}
                label={label}
                sectionName={sectionName}
                formName={formName}
                deleteDisabled={deleteDisabled}
                validate={(optional ? [] : [required].concat(validation || []))}
                warn={warn && warning}
                {...other}
              />
            </div>
          }
        </FormControl>
      </Grid>
    );
  }
}


FileForm.propTypes = {
  /**
   * Name of the field used by react-form and as unique id.
   */
  fieldName: PropTypes.string.isRequired,
  /**
   * form name
   */
  formName: PropTypes.string.isRequired,
  /**
   * section name
   */
  sectionName: PropTypes.string.isRequired,
  /**
   * label used in field, also placeholder is built from it by adding 'Provide'
   */
  label: PropTypes.node,
  /**
   * props passed to wrapped TextField
   */
  textFieldProps: PropTypes.node,
  /**
   * unique text used as placeholder
   */
  placeholder: PropTypes.text,
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
   * read only mode
   */
  readOnly: PropTypes.bool,
  /** 
   * Don't display 'X' button
   */
  deleteDisabled: PropTypes.bool,
};

FileForm.defaultProps = {
  placeholder: null,
};


export default FileForm;
