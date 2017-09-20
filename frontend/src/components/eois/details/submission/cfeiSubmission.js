import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../common/list/headerList';
import ConceptNoteSubmission from './conceptNoteSubmission';

const messages = {
  title: 'Concept Note',
};

const title = () => (
  <Typography type="headline">{messages.title}</Typography>
);

const CfeiSubmission = (props) => {
  const { partnerId } = props;
  return (
    <HeaderList
      header={title()}
      rows={[<ConceptNoteSubmission />]}
    />
  );
};

CfeiSubmission.propTypes = {
  partnerId: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  partnerId: ownProps.params.id,
});

export default connect(
  mapStateToProps,
)(CfeiSubmission);

