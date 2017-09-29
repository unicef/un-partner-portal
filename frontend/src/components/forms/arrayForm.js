import React, { Component } from 'react';
import { FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import Divider from 'material-ui/Divider';
import List, { ListItem } from 'material-ui/List';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import GridColumn from '../common/grid/gridColumn';


const styleSheet = createStyleSheet('ArrayForm', theme => ({
  outerPaper: {
    background: theme.palette.primary[200],
  },
  innerPaper: {
    padding: theme.spacing.unit * 2,
    background: theme.palette.primary[400],
  },
  list: {
    padding: 0,
  },
}));


class RenderArrayMembers extends Component {
  constructor(props) {
    super(props);
    if (props.initial && !props.readOnly) props.fields.push({});
  }

  render() {
    const {
      limit,
      fields,
      outerField,
      innerField,
      classes,
      readOnly } = this.props;
    return (
      <Paper elevation={0} className={classes.outerPaper} >
        <List className={classes.list}>
          {fields.map((member, index) => (
            <div>
              <ListItem key={index} >
                <GridColumn >
                  <Grid container direction="row" >
                    <Grid item xs={!readOnly ? 10 : 12} >
                      {outerField(member, index, fields)}
                    </Grid>
                    {index > 0 && !readOnly && <Grid item xs={2} >
                      <IconButton
                        type="button"
                        title="Remove Member"
                        onClick={() => fields.remove(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                    }
                  </Grid>
                  <Paper elevation={0} className={classes.innerPaper}>
                    {innerField(member, index, fields)}
                  </Paper>
                </GridColumn>
              </ListItem>
              <Divider />
            </div>
          ))}

          {fields.length < limit && !readOnly &&
            <Button
              color="accent"
              onClick={() => fields.push({})}
            >
              + Add New
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
};


const renderMembers = withStyles(styleSheet)(RenderArrayMembers);

const ArrayForm = (props) => {
  const { fieldName,
    outerField,
    innerField,
    limit,
    label,
    initial,
    readOnly } = props;
  return (
    <div>
      <Typography type="caption">{label}</Typography>
      <FieldArray
        limit={limit}
        name={fieldName}
        component={renderMembers}
        outerField={outerField}
        innerField={innerField}
        initial={initial}
        readOnly={readOnly}
      />
    </div>
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
};

export default withStyles(styleSheet)(ArrayForm);
