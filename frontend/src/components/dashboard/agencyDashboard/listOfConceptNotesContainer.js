import React from 'react';
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
      header={<Typography style={{ margin: 'auto 0' }} type="headline" >{messages.title}</Typography>}
      loading={loading}
    >
      <ListOfConceptNotesTable />
    </HeaderList>
  );
};

ListOfConceptNotesContainer.propTypes = {
  loading: PropTypes.bool,
};

export default ListOfConceptNotesContainer;
