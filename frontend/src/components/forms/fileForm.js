import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { FormControl, FormLabel } from 'material-ui/Form';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import FileUploadButton from '../common/buttons/fileUploadButton';
import { renderFileDownload, renderFormControl } from '../../helpers/formHelper';
import { required, warning } from '../../helpers/validation';

const messages = {
  download: 'Download',
};

const styleSheet = createStyleSheet('mainLayout', theme => ({
  root: {
    width: 0.1,
    height: 0.1,
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1,
  },
  iconLabel: {
    alignItems: 'center',
    minWidth: 72,
    whiteSpace: 'nowrap',
    overflow: 'hidden !important',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    width: '100%',
  },
  wrapContent: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapContentButton: {
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
  },
  downloadIcon: {
    fill: theme.palette.accent[700],
    marginRight: 5,
  },
  FileNameField: {
    minWidth: 72,
    paddingBottom: theme.spacing.unit,
    borderBottom: '1px solid',
  },
  icon: {
    marginRight: theme.spacing.unit,
  },
  button: {
    padding: '11px 0px',
  },
}));

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
    const { classes, fieldName, label, optional, validation, warn, readOnly, ...other } = this.props;

    return (
      <Grid item>
        <FormControl fullWidth>
          {readOnly
            ? [
              <Field
                name={fieldName}
                label={label}
                component={renderFileDownload(this.props, messages)}
                optional={optional}
              />]
            :
            <Field
              name={fieldName}
              component={renderFormControl}
              validate={optional ? [] : [required].concat(validation || [])}
              warn={warn ? [warning] : []}
              {...other}
            >
              <FormLabel>{label}</FormLabel>
              <FileUploadButton fileSelected={(file) => {}} />
            </Field>
          }
        </FormControl>
      </Grid>
    );
  }
}


FileForm.propTypes = {
  classes: PropTypes.object,
  /**
   * Name of the field used by react-form and as unique id.
   */
  fieldName: PropTypes.string.isRequired,
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
};

FileForm.defaultProps = {
  placeholder: null,
};


export default withStyles(styleSheet)(FileForm);
