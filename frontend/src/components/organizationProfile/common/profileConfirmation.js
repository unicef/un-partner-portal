import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import ProfileViewLink from './profileViewLink';

const messages = {
  confirm: 'I confirm that my profile is up to date',
  lastUpdate: 'Last profile update:',
  notSure: 'Not sure?',
};

const styleSheet = theme => ({
  checkboxContainer: {
    marginLeft: -14,
  },
  paddingTop: {
    padding: '12px 0px 0px 0px',
  },
  alignVertical: {
    display: 'flex',
    alignItems: 'top',
  },
  captionStyle: {
    color: theme.palette.primary[500],
  },
});

const ProfileConfirmation = (props) => {
  const { classes, disabled, checked, onChange } = props;
  return (
    <div className={classes.checkboxContainer}>
      <div className={classes.alignVertical}>
        <Checkbox
          disabled={disabled}
          checked={checked}
          onChange={onChange}
        />
        <div className={classes.paddingTop}>
          <Typography type="body1">{messages.confirm}</Typography>
          <div className={classes.alignVertical}>
            <Typography className={classes.captionStyle} type="body1">
              {`${messages.lastUpdate} ${messages.update}. ${messages.notSure} `}
            </Typography>
            &nbsp;
            <ProfileViewLink />
          </div>
        </div>
      </div>
    </div>
  );
};

ProfileConfirmation.propTypes = {
  classes: PropTypes.object,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

export default withStyles(styleSheet, { name: 'ProfileConfirmation' })(ProfileConfirmation);
