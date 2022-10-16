import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import axios from 'axios';

import { useTheme } from '@mui/material/styles';
import { useState } from 'react';


const titleVariants = {
  [true]: 'h3',
  [false]: 'h1',
}


export default function Header({ videoPresent, setVideoPresent, setTimestampScores, timestampsRef, setVideoName, videoNames, setVideoNames }) {
  const theme = useTheme();

  return (
    <Paper sx={{
      display: 'flex',
      flexDirection: videoPresent ? 'row' : 'column',
      justifyContent: videoPresent ? 'center' : 'flex-start',
      alignItems: 'center',
      paddingTop: videoPresent ? '0%' : '7%',
      height: videoPresent ? '10vh' : '100vh',
      position: 'relative',
      zIndex: '2',
    }}>
      <Title videoPresent={videoPresent} />
      <Search hidden={!videoPresent} setTimestampScores={setTimestampScores} timestampsRef={timestampsRef} />
      <UploadButton videoPresent={videoPresent} setVideoPresent={setVideoPresent} setVideoName={setVideoName} videoNames={videoNames} setVideoNames={setVideoNames} />
    </Paper>
  )
}


function Title({ videoPresent }) {
  const theme = useTheme();

  return (
    <Box
      component="img"
      sx={{
        height: videoPresent ? '150%' : '50%',
        marginTop: '0.4%',
      }}
      alt="logo"
      src={ videoPresent ? '/logo small.png' : '/logo large.png' }
    />
  )
}

function Search({ hidden, setTimestampScores, timestampsRef }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <form
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
      hidden={hidden}
      onSubmit={(e) => {
        e.preventDefault()
        axios.get('http://localhost:5000/search', {
          params: {
            query: searchQuery,
          },
        }).then((res) => {
          if (res?.data?.success) {
            setTimestampScores(res.data.similarities)
            timestampsRef.current.scrollIntoView()
          } else {
            console.log('sad :( something messed up :(((( sad by xxxtentacion')
          }
        })
      }}
    >
      <TextField
        id="search-bar"
        className="text"
        onInput={(e) => {
          setSearchQuery(e.target.value);
        }}
        label="Enter a search query"
        variant="outlined"
        placeholder="Search..."
        size="small"
        sx={{
          width: '50vw',
          marginLeft: '5vw',
        }}
      />
      <IconButton
        type="submit"
        aria-label="search"
        sx={{
          marginRight: '5vw',
        }}
      >
        <SearchIcon />
      </IconButton>
    </form>
  )
}

function UploadButton({ videoPresent, setVideoPresent, setVideoName, videoNames, setVideoNames }) {
  const theme = useTheme();

  return (
    <Button
      size={videoPresent ? 'small' : 'large'}
      variant={videoPresent ? 'outlined' : 'contained'}
      sx={{
        paddingLeft: videoPresent ? '1%' : '10%',
        paddingRight: videoPresent ? '1%' : '10%',
        marginTop: videoPresent ? '0%' : '0%',
        borderRadius: '20px',
      }}
      component="label"
    >
      <Typography
        variant={videoPresent ? 'h6' : 'h4'}
        sx={{color: theme.palette.text.primary}}
      >
        {videoPresent ? 'Upload' : 'Upload a video to start'}
        <input
          hidden
          accept="video/*"
          type="file"
          onChange={(e) => {
            // setVideoPresent(true)
            const bodyFormData = new FormData();
            bodyFormData.append('video', e.target.files[0]);
            
            axios({
              method: 'post',
              url: 'http://localhost:5000/upload',
              data: bodyFormData,
              headers: { 'Content-Type': 'multipart/form-data' },
            }).then((res) => {
              setVideoPresent(res?.data?.success)
              if (res?.data?.success) {
                setVideoNames([ ...videoNames, e.target.files[0].name ])
                setVideoName(e.target.files[0].name)
              }
            })
          }}
        />
      </Typography>
    </Button>
  )
}

// #d371f3
