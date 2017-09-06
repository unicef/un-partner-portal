
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import React from 'react';
import MoreVert from 'material-ui-icons/MoreVert';
import { withStyles, createStyleSheet } from 'material-ui/styles';

const styleSheet = createStyleSheet('HqProfileOverviewHeader', (theme) => {
  const paddingSmall = theme.spacing.unit * 3;
  const padding = theme.spacing.unit * 4;

  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: `${paddingSmall}px`,
    },
  };
});


const PartnerProfileHeader = (props) => {
  const { classes, handleMoreClick } = props;

  return (
    <div className={classes.root}>
      <IconButton onClick={handleMoreClick} >
        <MoreVert />
      </IconButton>
    </div>

  );
};

PartnerProfileHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  handleMoreClick: PropTypes.func.isRequired,
};

export default withStyles(styleSheet)(PartnerProfileHeader);
