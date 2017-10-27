import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectSector } from '../../../store';

const renderShortCell = data => data.map(sector => sector.name).join(', ');

const UnsolicitedSectorCell = (props) => {
  const { id, sectors } = props;

  return (
    <div data-tip data-for={`${id}-sector-tooltip`}>
      {renderShortCell(sectors)}
    </div>
  );
};

UnsolicitedSectorCell.propTypes = {
  sectors: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
};

export default connect(
  (state, ownProps) => ({
    sectors: ownProps.data.map(s => ({
      name: selectSector(state, s),
    })),
  }),
)(UnsolicitedSectorCell);
