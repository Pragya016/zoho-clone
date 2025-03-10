import * as React from 'react';
import Popover from '@mui/material/Popover';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import { Link } from 'react-router-dom';

export default function Settings() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <IconButton onClick={handleClick}>
        <SettingsIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
      <Link to='/change-password'>change-password</Link>
      </Popover>
    </div>
  );
}