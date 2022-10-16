import React from 'react'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { CardMedia } from '@mui/material'
import { Container } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { useState, useEffect, useRef } from 'react';

const MINIMUM_SCORE = 2.8


export default function Body({ timestampScores }) {
  const videoElement = useRef()
  return (
    <>
      <UploadedVideo videoRef={videoElement} />
      <Timestamps timestampScores={timestampScores} videoElement={videoElement} />
    </>
  )
}


export function UploadedVideo({ videoRef }) {
  const theme = useTheme();
  return (
    <Container>
      <CardMedia
        component="video"
        controls
        autoPlay
        ref={videoRef}
        src="http://localhost:5000/static/video.mp4"
        sx={{
          marginTop: "8vh",
          maxHeight: "80vh",
          marginBottom: '3%',
        }}
      />
    </Container>
  )
}



export function Timestamps({ timestampScores, videoElement }) {
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
        color: theme.palette.text.primary,
        marginTop:"1vh"
      }}
    >
      <Grid container spacing={2}>
        {timestamps}
      </Grid>
    </Container>
  )
}

