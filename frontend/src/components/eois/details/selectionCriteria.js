import React from 'react';
import Typography from 'material-ui/Typography';
import GridColumn from '../../common/grid/gridColumn';
import HeaderList from '../../common/list/headerList';
import PaddedHeader from '../../common/paddedHeader';

const messages = {
  title: 'Selection Criteria',
};

const title = () => (
  <Typography type="subheading" >{messages.title}</Typography>
);

const SelectionCriteria = (props) => {
  return (
    <HeaderList
      header={title}
      rows={['Sector expertise and experience', 'Contribusion to resources']}
    />
  );
};

export default SelectionCriteria;
