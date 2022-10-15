import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import AdbIcon from '@mui/icons-material/Adb';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState } from 'react';

import Header from './components/header'


const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main:"#e53935"
    }
  }
});


export default function App() {
  const [videoPresent, setVideoPresent] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          height: '100vh',
        }}
      >
        <Header videoPresent={videoPresent} setVideoPresent={setVideoPresent} />
      </Box>
    </ThemeProvider>
  );
}
