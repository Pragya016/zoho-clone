import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  navbar: {
    background: 'white'
  }
})

export default function SimpleNavbar() {
  const styles = useStyles();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className={styles.navbar}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Zoho
          </Typography>
          <Button color="inherit">Sign in</Button>
          <Button color="inherit" variant='outlined'>Sign Up</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
