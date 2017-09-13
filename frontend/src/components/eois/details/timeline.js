import React from 'react';
import Typography from 'material-ui/Typography';
import HeaderList from '../../common/list/headerList';
import TimelineComponent from '../../common/timeline';

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
      rows={[<TimelineComponent />]}
    />
  );
};

export default Timeline;
