import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import "./AppBar.css";
import { auth, signOut } from "../../firebase";

function NewsAppBar( {user, setUser} ) {

  // see firebase docs
  async function handleSignOut() {
    try {
      await signOut(auth);
      setUser(null);
      console.log("Successfully signed out");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  return (
    <Box className="app-bar-box">
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
          {user && (<Button onClick={handleSignOut} variant="contained"
          sx={{
            backgroundColor: "black",
            marginLeft: "300px",
          }}>
            Sign Out
          </Button>)}
          <Typography className="title" variant="h2" component="div">
            news | menu
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NewsAppBar;