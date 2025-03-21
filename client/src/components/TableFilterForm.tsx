import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import styles from "./css/table.filter.form.module.css";
import SearchIcon from "@mui/icons-material/Search";
import { BaseSyntheticEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useAdmin } from "../context/Admin";
import { fetchData } from "../utility";
import { filterEmployees } from "../store/slices/employee.slice";
import { toast, ToastContainer } from "react-toastify";

interface FormDataInterface {
    [key: string]: string;
}

const initialState = { search: '', type: '' };

export default function TableFilterForm() {
  const [formData, setFormData] = useState<FormDataInterface>(initialState);
  const dispatch = useDispatch();
  const { admin } = useAdmin();

  function handleChange(e: BaseSyntheticEvent) {
    const value = e.target.value;
    setFormData({...formData, search: value});
  }

  function handleSelect(e: SelectChangeEvent) {
    const value = e.target.value;
    setFormData({...formData, type: value});
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    searchData();
  }

  async function searchData() {
    try {
      if (!admin || !admin.id) {
        console.error("Admin is undefined while searching");
        return;
      }

      const token = localStorage.getItem('idToken');

      if(!token) {
        toast.error("Something went wrong. Please try again after sometime");
        return;
      }

      const res = await fetchData(
        `/api/admin/filter?adminId=${admin.id}&q=${formData.search
          .toLowerCase()
          .trim()}&type=${formData.type}`,
        "GET",
        null,
        token
      );

      if (res.status === 200) {
        dispatch(filterEmployees(res.data.data));
      }

      setFormData(initialState);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
    <form id={styles.form} onSubmit={handleSearch}>
      <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
        <OutlinedInput
          id="outlined-adornment-weight"
          value={formData.search}
          onChange={handleChange}
          placeholder="search..."
          startAdornment={<SearchIcon className={styles.searchIcon} />}
          aria-describedby="outlined-weight-helper-text"
          inputProps={{
            "aria-label": "search",
          }}
        />
      </FormControl>
      <FormControl required sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-required-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          value={formData.type}
          label="Type *"
            onChange={handleSelect}
        >
          <MenuItem value='contains'>Contains</MenuItem>
          <MenuItem value='equals'>Equals</MenuItem>
          <MenuItem value='less-than'>Less than</MenuItem>
          <MenuItem value='greater-than'>Greater than</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" id={styles.searchButton} type="submit">
        Get Results
      </Button>
    </form>
    <ToastContainer closeOnClick={true} />
    </>
  );
}
