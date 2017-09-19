import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import FileUpload from 'material-ui-icons/FileUpload';
import Attachment from 'material-ui-icons/Attachment';
import { FormLabel, FormControlLabel } from 'material-ui/Form';
import { renderFormControl } from '../../helpers/formHelper';
import { required, warning } from '../../helpers/validation';


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
    display: 'flex',
    alignItems: 'center',
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
    const {
      classes,
      fieldName,
      label,
      optional,
      validation,
      warn,
      ...other } = this.props;
    const { fileAdded } = this.state;
    return (
      <Grid item>
        <Field
          name={fieldName}
          component={renderFormControl}
          validate={optional ? [] : [required].concat(validation || [])}
          warn={warn ? [warning] : []}
          {...other}
        >
          <FormLabel>{label}</FormLabel>

          <FormControlLabel
            control={
              <input
                onChange={this.handleChange}
                className={classes.root}
                name={`${fieldName}-input`}
                id={`${fieldName}-input`}
                type="file"
              />
            }
          />
          <Button dense classes={{ root: classes.button }} color="accent" >
            <label className={classes.iconLabel} htmlFor={`${fieldName}-input`}>
              {fileAdded
                ? (
                  <Typography className={[classes.iconLabel, classes.FileNameField]} gutterBottom >
                    <Attachment className={classes.icon} />
                    {this.renderFileName(fieldName)}
                  </Typography>)
                : ([
                  <FileUpload className={classes.icon} />,
                  'Upload File']
                )
              }
            </label>
          </Button>
        </Field>
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
};

FileForm.defaultProps = {
  placeholder: null,
};


export default withStyles(styleSheet)(FileForm);
