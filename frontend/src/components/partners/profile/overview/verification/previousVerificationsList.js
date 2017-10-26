import React from 'react';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import VerificationItem from './verificationItem';
import GridColumn from '../../../../common/grid/gridColumn';
import PaddedContent from '../../../../common/paddedContent';

const styleSheet = theme => ({
  background: {
    backgroundColor: theme.palette.common.lightGreyBackground,
  },
});

const PreviousVerificationsList = (props) => {
  const { classes, verifications } = props;
  return (
    <Grid item className={classes.background} >
      {verifications.map(verification =>
        (<GridColumn>
          <Divider />
          <PaddedContent>
            <VerificationItem verification={verification} />
          </PaddedContent>
        </GridColumn>),
      )}
    </Grid>);
};

PreviousVerificationsList.propTypes = {
  verifications: PropTypes.array,
  classes: PropTypes.object,
};

export default withStyles(styleSheet,
  { name: 'PreviousVerificationsList' })(PreviousVerificationsList);
