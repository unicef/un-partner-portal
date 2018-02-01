import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import HeaderList from '../../common/list/headerList';
import ListOfOpenCfeiTable from './listOfOpenCfeiTable';


const messages = {
  title: 'List of open CFEIs',
};

const ListOfConceptNotesContainer = (props) => {
  const { loading } = props;
  return (
    <HeaderList
      header={<Typography type="headline" >{messages.title}</Typography>}
      loading={loading}
    >
      <ListOfOpenCfeiTable />
    </HeaderList>
  );
};

ListOfConceptNotesContainer.propTypes = {
  loading: PropTypes.bool,
};

export default ListOfConceptNotesContainer;
