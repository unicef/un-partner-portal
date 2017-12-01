import purple from 'material-ui/colors/deepPurple';
import blue from 'material-ui/colors/blue';
import grey from 'material-ui/colors/grey';
import getMuiTheme from 'material-ui-old/styles/getMuiTheme';
import store from '../store';

export const chartColors = ['#668DDB', '#F7C848', '#ADEAC0', '#A996D8', '#EE7635'];

const getColorTheme = () => {
  const role = store.getState().session.role;
  return (role && role === 'agency')
    ? blue
    : { ...purple, 500: '#6B5CA5' };
};

const getOldTheme = () => {
  const role = store.getState().session.role;
  const mainColor = (role === 'agency') ? '#5b92e5' : '#6B5CA5';
  return {
    pickerHeaderColor: mainColor,
    primary1Color: mainColor,
    primary2Color: mainColor,
    accent1Color: mainColor,
  };
};

export const muiOldTheme = () => getMuiTheme({
  palette: getOldTheme(),
});

const theme = {
  palette: {
    primary: { ...grey, strong: '#233944' },
    secondary: purple,
  },
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
      padding: {
        paddingTop: 0,
        paddingBottom: 0,
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
    },
    MuiTypography: {
      headline: {
        color: 'inherit',
      },
    },
    MuiIconButton: {
      root: {
        height: 24,
        width: 24,
      },
    },
    MuiFormLabel: {
      root: {
        color: 'rgba(0, 0, 0, 0.34)',
        zIndex: 1,
        transform: 'scale(0.75)',
        transformOrigin: 'left top',
        pointerEvents: 'none',
      },
      focused: {
        color: 'rgba(0, 0, 0, 0.34)',
      },
    },
    MuiInput: {
      input: {
        'label + $formControl > &': {
          opacity: 0.5,
        },
      },
    },
    MuiTableCell: {
      paddingDefault: {
        '&:not(:first-child)': {
          paddingLeft: '8px',
        },
      },
    },
    MuiDefaultTab: {
      fontWeight: 400,
    },
  },
};
const getTheme = () => (
  {
    ...theme,
    zIndex: {
      ...theme.zIndex,
      dialog: 999,
    },
    palette: {
      ...theme.palette,
      secondary: getColorTheme(),
      success: {
        primary: '#72C300',
        secondary: '#BEF078',
      },
      common: {
        arrayFormOuter: '#F5F5F5',
        arrayFormInner: '#E0E0E0',
        lightGreyBackground: '#F5F5F5',
        darkGreyBackground: '#EEEEEE',
        statusOk: '#189a58',
        orange: '#F39C38',
        purple: '#A996D8',
        blue: '#87B0EE',
        green: '#72C300',
        gray: '#F6F6F6',
        formLabel: 'rgba(0, 0, 0, 0.34)',
        grayText: '#757575',
      },
      eoiStatus: {
        completed: '#5B92E5',
        closed: '#233944',
        open: '#72C300',
      },
      dateColors: {
        dark: '#233944',
        green: '#72C300',
        red: '#EA4022',
        blue: '#0099FF',
      },
      flags: {
        red: '#D50000',
        yellow: '#FFC400',
      },
    },
    typography: {
      headline: {
        fontSize: '1.25rem',
      },
    },
    overrides: {
      ...theme.overrides,
      MuiRadio: {
        checked: {
          color: getColorTheme()[500],
        },
      },
      MuiCheckbox: {
        checked: {
          color: getColorTheme()[500],
        },
        disabled: {
          color: getColorTheme()[200],
        },
      },
    },
  }
);

export default getTheme;
