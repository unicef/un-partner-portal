import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import withCountryName from '../common/hoc/withCountryName';

const PartnerProfileExperienceCell = (props) => {
  const { experience } = props;

  if (experience) {
    return (<TableCell>{experience.map((value) => {
      if (R.last(experience) !== value) {
        return (`${value}, `);
      }
      return (`${value}`);
    },
    )}</TableCell>);
  }

  return <TableCell />;
};

PartnerProfileExperienceCell.propTypes = {
  experience: PropTypes.array,
};

export default withCountryName(PartnerProfileExperienceCell);
