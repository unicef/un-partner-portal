import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import InfoIcon from 'material-ui-icons/Info';
import Grid from 'material-ui/Grid';
import { MenuItem } from 'material-ui-old/Menu';

import { renderSelectField } from '../../helpers/formHelper';
import { required } from '../../helpers/validation';
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
    const { fieldName, label, infoIcon, infoText, values,
      optional, validation } = this.props;
    return (
      <Grid item>
        <Grid container direction="row" align="flex-end" wrap="nowrap">
          <Grid item xs={infoIcon ? 11 : 12}>
            <Field
              name={fieldName}
              component={renderSelectField}
              floatingLabelFixed
              floatingLabelText={label}
              hintText={`Select ${label.toLowerCase()}`}
              onChange={this.handleChange}
              validate={optional ? [] : [required].concat(validation || [])}
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
   * if field is optional
   */
  optional: PropTypes.bool,
  /**
   * validations passed to field
   */
  validation: PropTypes.arrayOf(PropTypes.func),
};

export default SelectForm;
