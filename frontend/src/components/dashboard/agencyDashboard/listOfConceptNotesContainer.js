import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import HeaderList from '../../common/list/headerList';
import ListOfConceptNotesTable from './listOfConceptNotesTable';


const messages = {
  title: 'List of Concept Notes requiring your scoring',
};

const ListOfConceptNotesContainer = (props) => {
  const { loading } = props;
  return (
    <HeaderList
      header={<Typography type="headline" >{messages.title}</Typography>}
      loading={loading}
      rows={[<ListOfConceptNotesTable />]}
    />
  );
};

ListOfConceptNotesContainer.propTypes = {
  loading: PropTypes.bool,

};

export default ListOfConceptNotesContainer;
