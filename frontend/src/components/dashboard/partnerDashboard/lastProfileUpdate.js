import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router';
import GridRow from '../../common/grid/gridRow';
import GridColumn from '../../common/grid/gridColumn';
import PaddedContent from '../../common/paddedContent';
import { formatDateForPrint } from '../../../helpers/dates';

const messages = {
  title: 'Last Profile Update',
  button: 'view profile',
};

const styleSheet = theme => ({
  date: {
    paddingRight: theme.spacing.unit * 2,
  },
});


const LastProfileUpdate = (props) => {
  const { date, classes } = props;
  return (
    <Paper>
      <PaddedContent>
        <GridRow>
          <Typography type="headline">{messages.title}</Typography>
          <GridColumn align="flex-end">
            <Typography
              className={classes.date}
              type="headline"
            >
              {formatDateForPrint(date)}
            </Typography>
            <Button component={Link} to="/profile/" color="accent">{messages.button}</Button>
          </GridColumn>
        </GridRow>
      </PaddedContent>
    </Paper>
  );
};

LastProfileUpdate.propTypes = {
  date: PropTypes.string,
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'LastProfileUpdate;' })(LastProfileUpdate);
