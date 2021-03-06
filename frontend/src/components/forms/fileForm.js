import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import FileFormUploadButton from '../common/buttons/fileFormUploadButton';
import LocalFileFormUploadButton from '../common/buttons/localFileFormUploadButton';
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
    const { fieldName,
      label,
      optional,
      formName,
      sectionName,
      validation,
      warn,
      readOnly,
      localUpload,
      deleteDisabled,
      infoText,
      ...other } = this.props;
    return (
      <Grid item>
        {readOnly
          ? <Field
            name={fieldName}
            label={label}
            infoText={infoText}
            component={renderFileDownload(this.props)}
            optional={optional}
          />
          : <Field
            name={fieldName}
            component={localUpload ? LocalFileFormUploadButton : FileFormUploadButton}
            fieldName={fieldName}
            label={label}
            sectionName={sectionName}
            formName={formName}
            infoText={infoText}
            optional={optional}
            deleteDisabled={deleteDisabled}
            validate={(optional ? [] : [required].concat(validation || []))}
            warn={warn ? warning : undefined}
            {...other}
          />
        }
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
  formName: PropTypes.string,
  /**
   * section name
   */
  sectionName: PropTypes.string,
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
   * read only mode
   */
  readOnly: PropTypes.bool,
  /**
   * Don't display 'X' button
   */
  deleteDisabled: PropTypes.bool,
  /** 
   * render additional tooltip with label
   */
  infoText: PropTypes.node,

  localUpload: PropTypes.bool,
};

FileForm.defaultProps = {
  placeholder: null,
};


export default FileForm;
