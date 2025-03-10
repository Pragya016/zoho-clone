import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import { Employee } from './CRMTab';
import { Alert, IconButton } from '@mui/material';
import { fetchData } from '../utility';
import { useDispatch, useSelector } from 'react-redux';
import { editEmployees } from '../store/slices/employee.slice';

interface Props {
  data: Employee;
}

export interface FormDataInterface {
  name: string;
  email: string;
}

const initialState = {
  name: '',
  email: '',
}

export default function EditRowButton({data}: Props) {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<FormDataInterface>(initialState);
  const [error, setError] = React.useState<string>('');
  const dispatch = useDispatch();
  const employees = useSelector(state => state.employees);

  React.useEffect(() => {
    setFormData({email: data.email, name: data.name});
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

    if(error) {
      setError('');
    }
  }

  function handleSaveChanges() {
    if(!formData.name) {
      setError('Name field can\'t be empty');
      return;
    }

    if(!formData.email) {
      setError('Email field can\'t be empty');
      return;
    }

    const emailRegExp = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    if (!emailRegExp.test(formData.email)) {
      setError('Email is not valid');
      return;
    }

    updateUserDetails();
    setFormData(initialState);
  }

  async function updateUserDetails() {
    try {
        const res = await fetchData(`/api/admin/${data.id}`, 'PATCH', formData);
        dispatch(editEmployees(res.data.response));
        setOpen(false);
    } catch (error) {
        console.error(error);
    }
  }
  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        <EditIcon color='primary'/>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Edit Row Data</DialogTitle>
        <DialogContent>
          {error && <Alert severity='error'>{error}</Alert>}
            <TextField
            autoFocus
            onFocus={() => setError('')}
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            onFocus={() => setError('')}
            required
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="text"
            fullWidth
            variant="standard"
            value={formData.email}
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
