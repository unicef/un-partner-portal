import R from 'ramda';
import { connect } from 'react-redux';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import SectorItem from './sectorItem';

const selectSectorsBySpecializations = (sectors, spec) =>
  R.uniq(R.flatten(R.map(item => R.keys(item), R.map(sp => R.filter(item => R.contains(sp, item), sectors), spec))));

const SectorsCell = (props) => {
  const { sectors, specializations } = props;

  const uniqueSpecializations = selectSectorsBySpecializations(sectors, specializations);
  return (
    <TableCell>
      {uniqueSpecializations.map(item => (
        <SectorItem sectorId={item} />
      ))}
    </TableCell>
  );
};

SectorsCell.propTypes = {
  specializations: PropTypes.array.isRequired,
  sectors: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  sectors: state.sectors.bySector,
});

export default connect(mapStateToProps, null)(SectorsCell);
