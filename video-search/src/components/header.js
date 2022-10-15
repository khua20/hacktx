import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AdbIcon from '@mui/icons-material/Adb';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';


const titleVariants = {
  [true]: 'h3',
  [false]: 'h1',
}


export default function Header({ videoPresent, setVideoPresent }) {
  const theme = useTheme();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: videoPresent ? 'row' : 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: videoPresent ? '10vh' : '100vh',
    }}>
      <Title variant={titleVariants[videoPresent]} />
      <Search hidden={!videoPresent} />
      <UploadButton videoPresent={videoPresent} setVideoPresent={setVideoPresent} />
    </Box>
  )
}


function Title({ variant }) {
  const theme = useTheme();

  return (
    <Stack direction="row">
      <Box
        component="img"
        sx={{
          height: theme.typography[variant].fontSize,
        }}
        alt="logo"
        src="https://www.w3.org/html/logo/downloads/HTML5_Logo_256.png"
      />
      <Typography
        variant={variant}
        noWrap
        component="a"
        sx={{
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: theme.palette.text.primary,
          userSelect: 'none',
        }}
      >
        LOGO
      </Typography>
    </Stack>
  )
}

function Search({ hidden }) {
  return (
    <p>
      hi
    </p>
  )
}

function UploadButton({ videoPresent, setVideoPresent }) {
  const theme = useTheme();

  return (
    <Button
      size={videoPresent ? 'small' : 'large'}
      variant={videoPresent ? 'outlined' : 'contained'}
      sx={{
        paddingLeft: videoPresent ? '1%' : '10%',
        paddingRight: videoPresent ? '1%' : '10%',
      }}
      onClick={() => setVideoPresent(true)}
      component="label"
    >
      <Typography
        variant={videoPresent ? 'h6' : 'h4'}
      >
        {videoPresent ? 'Upload' : 'Upload a video to start'}
        <input hidden accept="video/*" multiple type="file" />
        
      </Typography>
    </Button>
  )
}