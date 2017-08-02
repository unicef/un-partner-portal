
import createPalette from 'material-ui/styles/palette';
import purple from 'material-ui/colors/purple';
import blue from 'material-ui/colors/blue';
import grey from 'material-ui/colors/grey';
import store from '../store';

const getColorTheme = () => {
  const role = store.getState().session.role;
  return (role && role === 'agency')
    ? blue
    : purple;
};

const theme = {
  palette: createPalette({
    primary: { ...grey, strong: '#233944' },
    accent: purple,
  }),
  overrides: {
    typography: {
      fontSize: 20,
    },
    MuiAppBar: {
      root: {
        flexDirection: 'row',
        height: '100%',
        padding: 15,
        alignItems: 'center',
      },
    },
    MuiList: {
      root: {
        width: '100%',
      },
    },

    MuiListItem: {
      default: {
        paddingTop: '1.5em',
        paddingBottom: '1.5em',
      },
      gutters: {
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      button: {
        '&:hover': {
          color: grey[400],
          backgroundColor: grey[200],
        },
        '&.active': {
          color: grey[400],
          backgroundColor: grey[200],
        },
      },
    },
  },
};
const getTheme = () => (
  {
    ...theme,
    palette: {
      ...theme.palette,
      accent: getColorTheme() },
  }
);

export default getTheme;
