import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import { FormControl, FormLabel } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import { renderTextField } from '../../helpers/formHelper';
import { withStyles, createStyleSheet } from 'material-ui/styles';


const styleSheet = createStyleSheet('BasicInformation', theme => ({
  root: {
    position: 'relative',
    display:  'inline-block',
  },
  visibilityButton: {
    marginTop: 4,
    marginLeft: 8,
    position: 'absolute',
    top: 0,
    right: 0,
  },
}));

class PasswordFieldForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      visible: props.visible,
    };
  }

  toggleVisibility() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    const { classes, fieldName, label, textFieldProps, placeholder } = this.props;
    const { visible } = this.state;
    return (
      <Grid item className={classes.root}>
        <FormControl fullWidth>
          <FormLabel>{label}</FormLabel>
          <Field
            name={fieldName}
            placeholder={placeholder || `Provide ${label[0].toLowerCase() + label.slice(1)}`}
            component={renderTextField}
            type={visible ? 'text' : 'password'}
            {...textFieldProps}
          />
          <IconButton
            className={classes.visibilityButton}
            onTouchTap={() => this.toggleVisibility()}
            onMouseDown={e => e.preventDefault()}
          >
            {visible ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </FormControl>
      </Grid>
    );
  }
}


PasswordFieldForm.propTypes = {
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
};

PasswordFieldForm.defaultProps = {
  placeholder: null,
};

export default withStyles(styleSheet)(PasswordFieldForm);
