import React from 'react'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { CardMedia } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const MINIMUM_SCORE = 2.9


export default function Body({ timestampScores, timestampsRef, videoNames, videoName, setVideoName }) {
  const videoElement = useRef()
  return (
    <>
      <Container
        sx={{
          position: 'relative',
          zIndex: '2',
        }}
      >
        <VideoTabs videoName={videoName} videoNames={videoNames} setVideoName={setVideoName} />
        <UploadedVideo videoRef={videoElement} videoName={videoName} />
        <Timestamps timestampsRef={timestampsRef} timestampScores={timestampScores} videoElement={videoElement} />
      </Container>
      <Box 
        component="img"
        sx={{
          position: 'fixed',
          top: '0%',
          zIndex: '0',
          opacity: '12%',
        }}
        alt="fish background"
        src="fish background.png"
      />
    </>
  )
}


export function VideoTabs({ videoName, setVideoName, videoNames }) {
  const [tabs, setTabs] = useState(null);
  useEffect(() => {
    setTabs(videoNames.map((analyzedName) => {
      return (
        <Tab
          label={analyzedName}
          value={analyzedName}
          key={analyzedName}
        />
      )
    }))
  }, [videoNames])

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Tabs
        value={videoName}
        variant="fullWidth"
        onChange={(e, newValue) => {
          setVideoName(newValue)
          
          axios.post('http://localhost:5000/current', { video: newValue }).then((res) => {
            if (res?.data?.success) {
              console.log(`set current to ${newValue}`)
            } else {
              console.log('sad :( something messed up :(((( sad by xxxtentacion')
            }
          })
        }}
        aria-label="video tabs"
      >
        {tabs}
      </Tabs>
    </Box>
  )
}


export function UploadedVideo({ videoRef, videoName }) {
  useEffect(() => {
    videoRef.current.load()
  }, [videoName])

  return (
    <CardMedia
      component="video"
      controls
      autoPlay
      ref={videoRef}
      src={`http://localhost:5000/static/${videoName}`}
      sx={{
        maxHeight: "80vh",
        marginBottom: '3%',
      }}
    />
  )
}


export function Timestamps({ timestampScores, videoElement, timestampsRef }) {
  const theme = useTheme();
  const [timestamps, setTimestamps] = useState([])

  useEffect(() => {
    let newTimestamps = [...timestampScores]
    newTimestamps.sort((a, b) => {
      return b[0] - a[0]
    })
    newTimestamps = newTimestamps.filter(([ score, timestamp ]) => {
      return score > MINIMUM_SCORE
    })

    setTimestamps(newTimestamps.map(([ score, timestamp ]) => {
      var dateTime = new Date(null);
      dateTime.setSeconds(timestamp);
      dateTime.setMilliseconds(1000 * (timestamp % 1));
      var formattedTime = dateTime.toISOString().substr(14, 9);

      return (
        <Grid xs={1} key={timestamp}>
          <Button
            variant="text"
            sx={{
              height: '100%',
              width: '100%',
            }}
            onClick={(e) => {
              videoElement.current.currentTime = timestamp
            }}
          >
            {formattedTime}
          </Button>
        </Grid>
        )
      })
    )
  }, [timestampScores, videoElement])
  
  return (
    <Container
      sx={{
        a: theme.palette.text.primary,
        marginTop:"1vh"
      }}
    >
      <Grid container spacing={2} ref={timestampsRef}>
        {timestamps}
      </Grid>
    </Container>
  )
}

