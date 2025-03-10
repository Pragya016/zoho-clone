import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import { Alert, IconButton } from '@mui/material';
import { fetchData } from '../utility';
import { useDispatch } from 'react-redux';
import { updateTasks } from '../store/slices/task.slice';

interface Props {
  data: FormDataInterface;
}

export interface FormDataInterface {
  [key: string]: string | number
}

const initialState = {
  description: '',
  assignedBy: '',
  assignedTo: '',
}

export default function EditTaskButton({data}: Props) {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<FormDataInterface>(initialState);
  const [error, setError] = React.useState<string>('');
  const dispatch = useDispatch();

  React.useEffect(() => {
    setFormData({description: data.description, assignedBy: data.assigned_by, assignedTo: data.assigned_to});
  }, [data]);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleChange(e: React.BaseSyntheticEvent) {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  function handleSaveChanges() {
    if(!formData.description) {
      setError("Please fill this field 'Description'");
      return;
    }

    if(!formData.assignedBy) {
      setError("Please fill this field 'Assign By'");
      return;
    }

    if(!formData.assignedBy) {
      setError("Please fill this field 'Assign To'");
      return;
    }

    updateTaskDetails();
    setFormData(initialState);
  }

  async function updateTaskDetails() {
    try {
        const res = await fetchData(`/api/tasks/${data.id}`, 'PATCH', formData);
        dispatch(updateTasks(res.data));
        setOpen(false);
    } catch (error) {
        console.error(error);
    }
  }
  return (
    <React.Fragment>
      <IconButton style={{color: 'grey'}} onClick={handleClickOpen}>
        <EditIcon color='primary'/>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          {error && <Alert severity='error'>{error}</Alert>}
            <TextField
            autoFocus
            onFocus={() => setError('')}
            required
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={formData.description}
            onChange={handleChange}
          />
            <TextField
            autoFocus
            onFocus={() => setError('')}
            required
            margin="dense"
            id="assign_by"
            name="assignedBy"
            label="Assign By"
            type="text"
            fullWidth
            variant="standard"
            value={formData.assignedBy}
            onChange={handleChange}
          />
            <TextField
            autoFocus
            onFocus={() => setError('')}
            required
            margin="dense"
            id="assign_to"
            name="assignedTo"
            label="Assign To"
            type="text"
            fullWidth
            variant="standard"
            value={formData.assignedTo}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
