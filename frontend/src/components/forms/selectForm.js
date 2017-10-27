import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import InfoIcon from 'material-ui-icons/Info';
import Grid from 'material-ui/Grid';
import { MenuItem } from 'material-ui-old/Menu';
import { FormControl } from 'material-ui/Form';
import { renderSelectField, renderText } from '../../helpers/formHelper';
import { required, warning } from '../../helpers/validation';
import TooltipIcon from '../common/tooltipIcon';

class SelectForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: undefined,
      tooltipShown: false,
      iconHovered: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleChange(event, value) {
    this.setState({ selectedItem: value });
  }

  hideTooltip() {
    this.setState({ tooltipShown: false });
  }

  showTooltip() {
    this.setState({ tooltipShown: true });
  }

  handleMouseEnter() {
    this.showTooltip();
  }

  handleMouseLeave() {
    this.hideTooltip();
  }

  render() {
    const {
      fieldName,
      infoIcon,
      infoText,
      label,
      placeholder,
      selectFieldProps,
      values,
      warn,
      optional,
      validation,
      readOnly,
    } = this.props;
    return (
      <Grid item>
        <Grid container direction="row" align="flex-end" wrap="nowrap">
          <Grid item xs={infoIcon ? 11 : 12}>
            {readOnly ?
              <FormControl fullWidth>
                <Field
                  name={fieldName}
                  component={renderText}
                  values={values}
                  optional={optional}
                  label={label}
                />
              </FormControl>
              : <Field
                name={fieldName}
                component={renderSelectField}
                {...selectFieldProps}
                floatingLabelFixed
                floatingLabelText={label}
                hintText={placeholder || `Select ${label.toLowerCase()}`}
                validate={optional ? [] : [required].concat(validation || [])}
                warn={warn && warning}
                onChange={this.handleChange}
                style={{
                  height: '56px',
                }}
                inputStyle={{
                  'margin-top': 0,
                }}
                floatingLabelStyle={{
                  top: '22px',
                }}
                iconStyle={{
                  fill: 'rgba(0, 0, 0, 0.42)',
                  top: '10px',
                }}
                underlineStyle={{
                  'border-top': '1px solid rgba(0, 0, 0, 0.42)',
                  bottom: '6px',
                }}
                errorStyle={{
                  bottom: 0,
                }}
                fullWidth
              >
                {values.map((value, index) => (
                  <MenuItem
                    key={index}
                    value={value.value}
                    primaryText={value.label}
                  />
                ))}
              </Field>
            }
          </Grid>
          {infoIcon && (
            <Grid item xs={1} >
              <TooltipIcon
                infoText={infoText}
                Icon={InfoIcon}
              />
            </Grid>
          )}
        </Grid>
      </Grid>

    );
  }
}

SelectForm.propTypes = {
  /**
   * Name of the field used by react-form
   */
  fieldName: PropTypes.string.isRequired,
  /**
   * label used in field
   */
  label: PropTypes.node,
  /**
   * array of objects with values for menu items
   * {
   *   value: name of value represented by item
   *   label: label used for button
   * }
   */
  values: PropTypes.array.isRequired,
  /**
   * Whether to display info icon with tooltip next ot the field
   */
  infoIcon: PropTypes.bool,
  /**
   * text passed to tooltip
   */
  infoText: PropTypes.string,
  /**
   * text passed as placeholder to field
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
   * if field should display warning
   */
  warn: PropTypes.bool,
  /**
   * props passed to wrapped SelectField
   */
  selectFieldProps: PropTypes.object,
  /**
   * if form should be displayed in read only state
   */
  readOnly: PropTypes.bool,
};

export default SelectForm;
