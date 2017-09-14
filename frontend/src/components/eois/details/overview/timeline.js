import React from 'react';
import Typography from 'material-ui/Typography';
<<<<<<< HEAD:frontend/src/components/eois/details/timeline.js
import HeaderList from '../../common/list/headerList';
import TimelineComponent from '../../common/timeline';
=======
import HeaderList from '../../../common/list/headerList';
>>>>>>> 288a467392f51b32eea843e1b350d186781f0158:frontend/src/components/eois/details/overview/timeline.js

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
