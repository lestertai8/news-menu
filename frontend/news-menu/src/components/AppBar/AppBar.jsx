import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import "./AppBar.css";

function NewsAppBar() {
  return (
    <Box>
      <AppBar className="app-bar">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography className="title" variant="h2" component="div" sx={{ flexGrow: 1 }}>
            News Menu
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NewsAppBar;