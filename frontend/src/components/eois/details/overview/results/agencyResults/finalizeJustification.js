import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import PaddedContent from '../../../../../common/paddedContent';
import HeaderList from '../../../../../common/list/headerList';
import {
  selectCfeiDetails,
  isCfeiCompleted,
} from '../../../../../../store';

const messages = {
  title: 'Justification for completion',
  empty: 'No justification added.',
};

const FinalizeJustification = (props) => {
  const { justification, cfeiCompleted } = props;
  return (
    cfeiCompleted
      ? <HeaderList header={<Typography style={{ margin: 'auto 0' }} type="headline" >{messages.title}</Typography>}>
        <PaddedContent>
          <Typography type="body1" >
            {justification}
          </Typography>
        </PaddedContent>
      </HeaderList>
      : null
  );
};

FinalizeJustification.propTypes = {
  justification: PropTypes.string,
  cfeiCompleted: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);

  return {
    justification: cfei ? cfei.justification : messages.empty,
    cfeiCompleted: isCfeiCompleted(state, ownProps.id),
  };
};

export default connect(mapStateToProps, null)(FinalizeJustification);
