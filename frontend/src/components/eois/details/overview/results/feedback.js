import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../../common/list/headerList';
import PaddedContent from '../../../../common/paddedContent';

const messages = {
  title: 'Feedback',
  noInfo: 'No information available yet.',

};

const Fields = ({ feedback }) => {
  return (feedback
    ? <PaddedContent />
    : (<PaddedContent >
      <Typography>{messages.noInfo}</Typography>
    </PaddedContent>)
  );
};

Fields.propTypes = {
  feedback: PropTypes.string,
};

const ProjectDetails = ({ feedback }) => (
  <HeaderList
    header={<Typography type="headline" >{messages.title}</Typography>}
    rows={[<Fields type={feedback} />]}
  />
);

ProjectDetails.propTypes = {
  feedback: PropTypes.string,
};

export default ProjectDetails;
