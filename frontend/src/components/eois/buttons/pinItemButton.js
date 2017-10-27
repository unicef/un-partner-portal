import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PinIcon from '../../common/pinIcon';
import IconWithTextButton from '../../common/iconWithTextButton';
import { isCfeiPinned } from '../../../store';
import { changePinStatusCfei } from '../../../reducers/newCfei';

const messages = {
  pin: 'Pin',
  unpin: 'Unpin',
};

const PinItemIcon = (props) => {
  const { pinned, changePinStatus } = props;
  return (
    <IconWithTextButton
      icon={<PinIcon />}
      text={pinned ? messages.unpin : messages.pin}
      onClick={() => changePinStatus(pinned)}
    />
  );
};

PinItemIcon.propTypes = {
  id: PropTypes.string,
  pinned: PropTypes.bool,
  changePinStatus: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  pinned: isCfeiPinned(state, ownProps.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  changePinStatus: pinned => dispatch(changePinStatusCfei(ownProps.id, pinned)),
});


export default connect(mapStateToProps, mapDispatchToProps)(PinItemIcon);
