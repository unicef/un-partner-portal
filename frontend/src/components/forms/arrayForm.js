import React from 'react';
import { Field, FieldArray } from 'redux-form';
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


const styleSheet = createStyleSheet('BasicInformation', theme => ({
  outerPaper: {
    background: theme.palette.primary[200],
  },
  innerPaper: {
    padding: theme.spacing.unit * 2,
    background: theme.palette.primary[400],
  },
  listItem: {
    padding: theme.spacing.unit * 2,
  },
}));


const renderMembers = ({ limit, fields, outerField, innerField, classes }) => {
  return (
    <Paper elevation={0} className={classes.outerPaper} >
      <List>
        {fields.map((member, index) => (
          <div>
            <ListItem key={index}>
              <GridColumn >
                <Grid container direction="row" >
                  <Grid item xs={10} >
                    {outerField(member)}
                  </Grid>
                  <Grid item xs={2} >
                    <IconButton
                      type="button"
                      title="Remove Member"
                      onClick={() => fields.remove(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <Paper elevation={0} className={classes.innerPaper}>
                  {innerField(member)}
                </Paper>
              </GridColumn>
            </ListItem>
            <Divider />
          </div>
        ))}

        {fields.length <= limit &&
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
};

const ArrayForm = (props) => {
  const { classes, fieldName, outerField, innerField, limit, label } = props;
  return (
    <div>
      <Typography type="caption">{label}</Typography>
      <FieldArray
        limit={limit}
        classes={classes}
        name={fieldName}
        component={renderMembers}
        outerField={outerField}
        innerField={innerField}
      />
    </div>
  );
};

export default withStyles(styleSheet)(ArrayForm);
