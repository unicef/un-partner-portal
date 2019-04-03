import R from 'ramda';
import React, { Component } from 'react';
import { FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import List, { ListItem } from 'material-ui/List';
import classname from 'classnames';
import FieldLabelWithTooltipIcon from '../../components/common/fieldLabelWithTooltip';
import { EMPTY_ERROR } from '../../helpers/validation';

const messages = {
  addNew: '+ Add New',
};

const styleSheet = theme => ({
  root: {
    width: '100%',
  },
  outerPaper: {
    background: theme.palette.common.arrayFormOuter,
  },
  innerPaper: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
    margin: `${theme.spacing.unit}px 0px ${theme.spacing.unit}px 0px`,
    backgroundColor: theme.palette.common.arrayFormInner,
  },
  list: {
    padding: 0,
  },
  container: {
    display: 'flex',
  },
  items: {
    flexFlow: 'column wrap',
    flexBasis: '90%',
  },
  delete: {
    flexBasis: '10%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  default: {
    paddingTop: '1em',
    paddingBottom: '1em',
  },
  emptyPadding: {
    padding: '1em',
  },
  error: {
    border: '2px solid red',
  },
  errorText: {
    paddingLeft: theme.spacing.unit * 2,
  },
});

class RenderArrayMembers extends Component {
  constructor(props) {
    super(props);

    if (props.initial && !props.readOnly && props.fields.length === 0) {
      props.fields.push({});
    }
  }

  render() {
    const {
      limit,
      fields,
      outerField,
      innerField,
      classes,
      disableAdding,
      disableDeleting,
      meta: { error },
      readOnly } = this.props;
    const paperClass = classname(
      classes.outerPaper,
      { [classes.error]: error },
    );
    
    return (
      <Paper elevation={0} className={paperClass} >
        {error !== EMPTY_ERROR && error && <FormHelperText className={classes.errorText} error>{error}</FormHelperText>}

        {(readOnly && fields.length === 0) && <Typography className={classes.emptyPadding} type="body1">{'-'}</Typography>}
        <List className={classes.list}>
          {fields.map((member, index) => (
            <div key={member}>
              <ListItem classes={{ default: classes.default }} key={index} >
                <div className={classes.root}>
                  <div className={classes.container}>
                    <div className={classes.items}>
                      {outerField(member, index, fields)}
                    </div>
                    {R.pathOr(true, ['readOnly'], fields.get(index)) && !disableDeleting && index > 0 && !readOnly && <div className={classes.delete}>
                      <IconButton
                        type="button"
                        title="Remove Member"
                        onClick={() => fields.remove(index)}
                      ><DeleteIcon />
                      </IconButton>
                    </div>}
                  </div>
                  {innerField && <Paper elevation={0} classes={{ root: classes.innerPaper }} className={classes.innerPaper}>
                    {innerField && innerField(member, index, fields)}
                  </Paper>}
                </div>
              </ListItem>
              {(limit > 1 && !(fields.length === 1 && readOnly)) && <Divider />}
            </div>
          ))}
          {fields.length < limit && !readOnly && !disableAdding &&
            <Button
              color="accent"
              onClick={() => fields.push({})}
            >
              {messages.addNew}
            </Button>
          }
        </List>
      </Paper >
    );
  }
}

RenderArrayMembers.propTypes = {
  fields: PropTypes.object,
  meta: PropTypes.object,
  classes: PropTypes.object,
  /**
   * form or whole component displayed on the outer grey section
   * will recieve name to create unique field name, index of the field,
   * and all fields to read from already added values
   */
  outerField: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
  /**
    * form or whole component displayed on the inner darker grey section
    * will recieve name to create unique field name, index of the field,
    * and all fields to read from already added values
    */
  innerField: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
  /**
   * limit of the field array length
   */
  limit: PropTypes.number,
  /**
   * if true, add one empty field to the array at the beginning
   */
  initial: PropTypes.bool,
  /**
   * if form should display in read-only style
   */
  readOnly: PropTypes.bool,
  /**
   * if form should not be able to add items
   */
  disableAdding: PropTypes.bool,
  /**
   * if form should not be able to delete items
   */
  disableDeleting: PropTypes.bool,
};


const renderMembers = withStyles(styleSheet, { name: 'RenderArrayMembers' })(RenderArrayMembers);

const ArrayForm = (props) => {
  const { fieldName,
    outerField,
    innerField,
    limit,
    label,
    initial,
    disableAdding,
    disableDeleting,
    validate,
    infoText,
    readOnly } = props;
  return (
    <FormControl fullWidth>
      {label && <FieldLabelWithTooltipIcon
        infoText={infoText}
        tooltipIconProps={{
          name: fieldName,
        }}
      >
        {label}
      </FieldLabelWithTooltipIcon>}
      <FieldArray
        limit={limit}
        name={fieldName}
        component={renderMembers}
        outerField={outerField}
        innerField={innerField}
        initial={initial}
        disableAdding={disableAdding}
        disableDeleting={disableDeleting}
        readOnly={readOnly}
        validate={validate}
      />
    </FormControl>
  );
};

ArrayForm.propTypes = {
  /**
   * form or whole component displayed on the outer grey section
   * will recieve name to create unique field name, index of the field,
   * and all fields to read from already added values
   */
  outerField: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
  /**
    * form or whole component displayed on the inner darker grey section
    * will recieve name to create unique field name, index of the field,
    * and all fields to read from already added values
    */
  innerField: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
  /**
   * name of the field
   */
  fieldName: PropTypes.string,
  /**
   * limit of the field array length
   */
  limit: PropTypes.number,
  /**
   * label for the entire section
   */
  label: PropTypes.string,
  /**
   * if true, add one empty field to the array at the beginning
   */
  initial: PropTypes.bool,
  /**
   * if form should display in read-only style
   */
  readOnly: PropTypes.bool,
  /**
   * if form should not be able to add items
   */
  disableAdding: PropTypes.bool,
  /**
   * if form should not be able to delete items
   */
  disableDeleting: PropTypes.bool,
  /**
   * validations for the entire array
   */
  validate: PropTypes.array,
  /**
   * text/component for the tooltio
   */
  infoText: PropTypes.node,
};

export default withStyles(styleSheet, { name: 'ArrayForm' })(ArrayForm);
