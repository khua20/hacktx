import Box from '@mui/material/Box';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState } from 'react';

import Header from './components/header'
import Body from './components/body';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main:"#00cc88"
    }
  }
});


export default function App() {
  const [videoPresent, setVideoPresent] = useState(false);
  const [video, setVideo] = useState(null);
  const [timestampScores, setTimestampScores] = useState([]);
  
  axios.get('http://localhost:5000/video').then((res) => {
    if (res.status % 200 == 0 && res.status != 204) {  // if there is content
      setVideoPresent(true);
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Header
          videoPresent={videoPresent}
          setVideoPresent={setVideoPresent}
          setTimestampScores={setTimestampScores}
        />
        {videoPresent ? <Body timestampScores={timestampScores} video={video} /> : <></>}
      </Box>
    </ThemeProvider>
  );
}
