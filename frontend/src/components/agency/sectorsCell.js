import R from 'ramda';
import { connect } from 'react-redux';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import SectorItem from '../../components/applications/sectorItem';

const selectSectorsBySpecializations = spec =>
  R.uniq(R.map(item => item.sector, spec));

const SectorsCell = (props) => {
  const { specializations } = props;
  const uniqueSectors = selectSectorsBySpecializations(specializations);

  return (
    <TableCell>
      {uniqueSectors.map((item, index) => (
        <SectorItem key={index} sectorId={item} />
      ))}
    </TableCell>
  );
};

SectorsCell.propTypes = {
  specializations: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  sectors: state.sectors.bySector,
});

export default connect(mapStateToProps, null)(SectorsCell);
