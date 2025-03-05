import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface PopoverProps {
  onDelete: (id: number) => void;
}

export default function TablePopover({onDelete}: PopoverProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  function handleDelete(id: number) {
    onDelete(id);
  }

  return (
    <div>
      <MoreVertIcon aria-describedby={id} onClick={handleClick} sx={{cursor: 'pointer'}}/>
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
        {/* <ul>
          <li>Edit</li>
          <li>Delete</li>
        </ul> */}
        <p>Edit</p>
        <p onClick={handleDelete}>Delete</p>
      </Popover>
    </div>
  );
}
