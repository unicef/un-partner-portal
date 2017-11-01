import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import HeaderList from '../../common/list/headerList';
import EmptyContent from '../../common/emptyContent';


const messages = {
  title: 'List of Pending Offers',
};

const ListOfPendingOffers = (props) => {
  const { loading } = props;
  return (
    <HeaderList
      header={<Typography type="headline" >{messages.title}</Typography>}
      loading={loading}
      rows={[<EmptyContent />]}
    />
  );
};

ListOfPendingOffers.propTypes = {
  loading: PropTypes.bool,

};

export default ListOfPendingOffers;
