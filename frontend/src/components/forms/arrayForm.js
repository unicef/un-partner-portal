import React, { Component } from 'react';
import { FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import { FormControl, FormLabel } from 'material-ui/Form';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import Divider from 'material-ui/Divider';
import List, { ListItem } from 'material-ui/List';


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
    display: 'flex',
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
      readOnly } = this.props;

    return (
      <Paper elevation={0} className={classes.outerPaper} >
        <List className={classes.list}>
          {fields.map((member, index) => (
            <div>
              <ListItem classes={{ default: classes.default }} key={index} >
                <div className={classes.root}>
                  <div className={classes.container}>
                    <div className={classes.items}>
                      {outerField(member, index, fields)}
                    </div>
                    {!disableDeleting && index > 0 && !readOnly && <div className={classes.delete}>
                      <IconButton
                        type="button"
                        title="Remove Member"
                        onClick={() => fields.remove(index)}
                      ><DeleteIcon />
                      </IconButton>
                    </div>}
                  </div>
                  {innerField && <Paper elevation={0} classes={{ root: classes.innerPaper }} className={classes.innerPaper}>
                    {innerField(member, index, fields)}
                  </Paper>}
                </div>
              </ListItem>
              <Divider />
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
  classes: PropTypes.object,
  /**
   * form or whole component displayed on the outer grey section
   * will recieve name to create unique field name, index of the field,
   * and all fields to read from already added values
   */
  outerField: PropTypes.node,
  /**
    * form or whole component displayed on the inner darker grey section
    * will recieve name to create unique field name, index of the field,
    * and all fields to read from already added values
    */
  innerField: PropTypes.node,
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
    readOnly } = props;
  return (
    <FormControl fullWidth>
      <FormLabel>{label}</FormLabel>
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
  outerField: PropTypes.node,
  /**
    * form or whole component displayed on the inner darker grey section
    * will recieve name to create unique field name, index of the field,
    * and all fields to read from already added values
    */
  innerField: PropTypes.node,
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
};

export default withStyles(styleSheet, { name: 'ArrayForm' })(ArrayForm);
