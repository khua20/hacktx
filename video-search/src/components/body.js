import React from 'react'
import { CardMedia } from '@mui/material'

export default function Body() {
  return (
    <UploadedVideo />
  )
}


function UploadedVideo(){
  return (
    <div>
        <CardMedia
         component="video"
         controls
         src='/movie.mp4'
        />
    </div>
  )
}



