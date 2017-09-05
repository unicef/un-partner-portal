import React from 'react';
import Typography from 'material-ui/Typography';
import GridColumn from '../../common/grid/gridColumn';
import HeaderList from '../../common/list/headerList';
import PaddedHeader from '../../common/paddedHeader';

const messages = {
  title: 'Timeline',
};

const title = () => (
  <Typography type="subheading" >{messages.title}</Typography>
);

const Timeline = (props) => {
  return (
    <HeaderList
      header={title}
      rows={['timeline']}
    />
  );
};

export default Timeline;
