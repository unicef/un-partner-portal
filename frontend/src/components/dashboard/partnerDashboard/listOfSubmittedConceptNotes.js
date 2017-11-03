import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import HeaderList from '../../common/list/headerList';
import EmptyContent from '../../common/emptyContent';


const messages = {
  title: 'List of Submitted Concept Notes',
};

const ListOfSubmittedConceptNotes = (props) => {
  const { loading } = props;
  return (
    <HeaderList
      header={<Typography type="headline" >{messages.title}</Typography>}
      loading={loading}
      rows={[<EmptyContent />]}
    />
  );
};

ListOfSubmittedConceptNotes.propTypes = {
  loading: PropTypes.bool,

};

export default ListOfSubmittedConceptNotes;
