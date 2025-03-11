import * as React from 'react';
import Popover from '@mui/material/Popover';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteRowButton from './DeleteRowButton';
import EditRowButton from './EditRowButton';
import styles from './css/table.popover.module.css';
import { Employee } from '../context/Pagination';
import { IconButton } from '@mui/material';

interface PopoverProps {
  data: Employee;
}

export default function TablePopover({data}: PopoverProps) {
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
        <MoreVertIcon aria-describedby={id} sx={{cursor: 'pointer'}}/>
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
        <div id={styles.box}>
        <EditRowButton data={data}/>
        <DeleteRowButton data={data}/>
        </div>
      </Popover>
    </div>
  );
}
