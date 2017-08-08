import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import InfoIcon from 'material-ui-icons/Info';
import Grid from 'material-ui/Grid';
import { MenuItem } from 'material-ui-old/Menu';

import { renderSelectField } from '../../lib/formHelper';




const styleSheet = createStyleSheet("OrganizationTypes", theme => ({
  infoIcon: {
    fill: theme.palette.primary[500],
  },
}))


class SelectForm extends Component {

  constructor(props) {
    super(props);
    this.state = { selectedItem: undefined };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value) {
    this.props.onFieldChange && this.props.onFieldChange(value);
    this.setState({ selectedItem: value });
  }

  render() {
    const { classes, fieldName, label, infoIcon, values } = this.props;
    return (
      <Grid item>
        <Grid container direction='row' align='flex-end' wrap='nowrap'>
          <Grid item xs={infoIcon ? 11 : 12}>
            <Field
              name={fieldName}
              component={renderSelectField}
              floatingLabelFixed
              floatingLabelText={label}
              hintText={`Select ${label.toLowerCase()}`}
              onChange={this.handleChange}
              fullWidth>
              {values.map((value, index) => {
                return (
                  <MenuItem
                    key={index}
                    value={value.value}
                    primaryText={value.label}
                  />
                )
              })}
            </Field>
          </Grid>
          {infoIcon && (
            <Grid item xs={1} >
              <InfoIcon className={classes.infoIcon} />
            </Grid>
          )}
        </Grid>
      </Grid>

    )
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
   * callback to save selected value in parent's state
   */
  onFieldChange: PropTypes.func,
}

export default withStyles(styleSheet)(SelectForm);
