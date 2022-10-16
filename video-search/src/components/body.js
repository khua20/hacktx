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
        <video width="320" height="240" controls>
            <source src="/movie.mp4" type="video/mp4"/>
            
        </video>
    </div>
  )
}



