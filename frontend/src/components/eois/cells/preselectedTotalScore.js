import Typography from 'material-ui/Typography';
import React from 'react';
import { TableCell } from 'material-ui/Table';
import PropTypes from 'prop-types';
import DeleteButton from '../buttons/removePreselection';
import GridRow from '../../common/grid/gridRow';
import WithGreyColor from '../../common/hoc/withGreyButtonStyle';

const PreselectedTotalScore = (props) => {
  const { id, score, hovered } = props;
  const Delete = WithGreyColor(DeleteButton);
  const localScore = score || '-';
  return (
    <TableCell>
      <GridRow align="center" >
        <Typography type="body1" color="inherit">
          {localScore}
        </Typography>
        {hovered && <Delete id={id} />}
      </GridRow>
    </TableCell>
  );
};

PreselectedTotalScore.propTypes = {
  id: PropTypes.string,
  score: PropTypes.string,
  hovered: PropTypes.bool,
};

export default PreselectedTotalScore;
