import Box from '@mui/material/Box';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState, useRef, useEffect } from 'react';

import Header from './components/header'
import Body from './components/body';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      // main:"#00cc88",
      main:'#d371f3',
    }
  }
});


export default function App() {
  const [videoPresent, setVideoPresent] = useState(false);
  const [timestampScores, setTimestampScores] = useState([]);
  const [videoName, setVideoName] = useState('');
  const [videoNames, setVideoNames] = useState([]);

  const timestampsRef = useRef();
  
  useEffect(() => {
    axios.get('http://localhost:5000/current').then((res) => {
      if (res?.data?.success && res.data.current != null) {
        setVideoPresent(true);
        setVideoName(res.data.current)
      } else {
        setVideoPresent(false);
      }
    })
    
    axios.get('http://localhost:5000/analyzed').then((res) => {
      if (res?.data?.success) {
        setVideoNames(res.data.analyzed)
        if (res.data.analyzed.length > 0) {
          setVideoPresent(true);
          setVideoName(res.data.current)
        } else {
          setVideoPresent(false);
        }
      } else {
        setVideoPresent(false);
      }
    })
  }, [])

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
          timestampsRef={timestampsRef}
          setVideoName={setVideoName}
          videoNames={videoNames}
          setVideoNames={setVideoNames}
        />
        {videoPresent ?
          <Body
            timestampScores={timestampScores}
            timestampsRef={timestampsRef}
            videoName={videoName}
            setVideoName={setVideoName}
            videoNames={videoNames}
          />
            :
          <></>}
      </Box>
    </ThemeProvider>
  );
}
