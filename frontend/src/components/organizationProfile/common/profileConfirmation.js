import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import ProfileViewLink from './profileViewLink';
import { formatDateForPrint } from '../../../helpers/dates';

const messages = {
  confirm: 'I confirm that my profile is up to date',
  lastUpdate: 'Last profile update:',
  notSure: 'Not sure?',
};

const styleSheet = theme => ({
  checkboxContainer: {
    // marginLeft: -14,
  },
  paddingTop: {
    padding: '12px 0px 0px 0px',
  },
  alignVertical: {
    display: 'flex',
    alignItems: 'center',
  },
  captionStyle: {
    color: theme.palette.primary[500],
  },
});

const ProfileConfirmation = (props) => {
  const { classes, update, disabled, checked, partnerId, onChange } = props;
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
              {`${messages.lastUpdate} ${formatDateForPrint(update)}. ${messages.notSure} `}
            </Typography>
            &nbsp;
            <ProfileViewLink partnerId={partnerId} />
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
  partnerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
  update: PropTypes.string,
};

const mapStateToProps = state => ({
  partnerId: state.session.partnerId,
  update: state.session.lastUpdate,
});


export default compose(
  withStyles(styleSheet, { name: 'ProfileConfirmation' }),
  connect(mapStateToProps),
)(ProfileConfirmation);
