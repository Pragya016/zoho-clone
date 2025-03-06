import * as React from 'react';
import Popover from '@mui/material/Popover';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteRowButton from './DeleteRowButton';
import EditRowButton from './EditRowButton';
import { Employee } from './CRMTab';
import { useDispatch } from 'react-redux';
import styles from './css/table.popover.module.css';

interface PopoverProps {
  data: Employee;
}

export default function TablePopover({data}: PopoverProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const dispatch = useDispatch();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

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
        <div id={styles.box}>
        <EditRowButton data={data}/>
        <DeleteRowButton data={data}/>
        </div>
      </Popover>
    </div>
  );
}
