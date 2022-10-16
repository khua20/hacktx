import React from 'react'
import Grid from '@mui/material/Grid';

import { CardMedia } from '@mui/material'
import { Container } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { useState } from 'react';

export default function Body({ timestampScores }) {
  return (
    <>
      <UploadedVideo />
      <TimeStamps timestampScores={timestampScores} />
    </>
  )
}


export function UploadedVideo() {
  const theme = useTheme();
  return (
    <Container>
      <CardMedia
        component="video"
        controls
        src='video-search/public/movie.mp4'
        sx={{
          marginTop: "8vh",
        }}
      />
    </Container>
  )
}

export function TimeStamps({ timestampScores }) {
  const theme = useTheme();
  const[timestamps, setTimeStamps] = useState([])
  return (
    <Container
      
    >
      <Typography 
        sx={{
            marginTop:"7vh",
            color:"#ffffff"
            }}
      >
        Timestamps: 

      </Typography>
    </Container>
  )
}

