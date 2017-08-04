import createPalette from 'material-ui/styles/palette';
import purple from 'material-ui/colors/deepPurple';
import blue from 'material-ui/colors/blue';
import grey from 'material-ui/colors/grey';
import store from '../store';

const getColorTheme = () => {
  const role = store.getState().session.role;
  return (role && role === 'agency')
    ? blue
    : { ...purple, 500: '#6B5CA5' };
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
          backgroundColor: grey[200],
        },
        '&.active': {
          backgroundColor: grey[200],
        },
      },
    },
    MuiTypography: {
      headline: {
        color: 'inherit',
      },
    },
    MuiButton: {
      raisedAccent: {
        backgroundColor: '#6B5CA5',
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
