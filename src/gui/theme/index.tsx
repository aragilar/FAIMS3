/*
 * Copyright 2021, 2022 Macquarie University
 *
 * Licensed under the Apache License Version 2.0 (the, "License");
 * you may not use, this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND either express or implied.
 * See, the License, for the specific language governing permissions and
 * limitations under the License.
 *
 * Filename: index.tsx
 * Description:
 *   TODO
 */

import {createTheme, colors} from '@mui/material';
import typography from './typography';
import {Theme} from '@mui/material/styles';

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

const theme = createTheme({
  // spacing: 2,
  palette: {
    background: {
      default: '#FAFAFB',
    },
    primary: {
      main: '#1B3E93',
      light: '#5768c4',
      dark: '#001964',
    },
    // secondary: {
    //   100: colors.grey[100],
    //   200: colors.grey[200],
    //   light: colors.grey[300],
    //   400: colors.grey[400],
    //   main: colors.grey[500],
    //   600: colors.grey[600],
    //   dark: colors.grey[700],
    //   800: colors.grey[800],
    // },
    secondary: {
      main: '#E59136',
      contrastText: '#fff',
    },
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600],
    },
    // error: {
    //   main: colors.red[500],
    // },
  },
  // shadows: Shadows,
  typography,
  // shadows: Array(25).fill('none') as Shadows,
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          '&.MuiAppBar-root': {
            boxShadow: 'none',
          },
        },
        colorPrimary: {
          backgroundColor: '#1B3E93',
          color: '#fff',
          contrastText: '#fff',
          textColor: '#fff',
          indicatorColor: '#fff',
          text: {
            primary: '#fff',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '&.MuiTabs-root': {
            boxShadow: 'none',
            fontWeight: 'bold',
          },
          '&.MuiTab-root': {
            fontWeight: '700 !important',
          },
          '&.Mui-selected': {
            fontWeight: '700 !important',
            color: 'white',
            backgroundColor: '#DA9449',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.MuiTab-root': {
            fontWeight: 'bold',
          },
        },
      },
    },
  },
});

export default theme;
