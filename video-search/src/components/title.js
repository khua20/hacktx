import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import AdbIcon from '@mui/icons-material/Adb';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';


export default function Title({ videoPresent }) {
  const theme = useTheme();
  
  if (videoPresent) {
    return (
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
            }}
            >
              LOGO
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    )
  } else {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: '50vh',
      }}>
        <Stack direction="row">
          <Box
            component="img"
            sx={{
              height: theme.typography.h1.fontSize,
            }}
            alt="logo"
            src="https://www.w3.org/html/logo/downloads/HTML5_Logo_256.png"
          />
          <Typography
            variant="h1"
            noWrap
            component="a"
            sx={{
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                userSelect: 'none',
            }}
          >
          LOGO
          </Typography>
        </Stack>
      </Box>
    )
  }
}
