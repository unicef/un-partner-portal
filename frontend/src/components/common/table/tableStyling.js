
import { createStyleSheet } from 'material-ui/styles';

const styleSheet = createStyleSheet('TableStyleSheet', theme => ({
  paper: {
    width: '100%',
    overflowX: 'scroll',
  },
  limitedCell: {
    maxWidth: 250,
  },
  firstCell: {
    padding: `0px 4px 0px ${theme.spacing.unit * 4}px`,
  },
  row: {
    overflow: 'visible',
  },
}));

export default styleSheet;
