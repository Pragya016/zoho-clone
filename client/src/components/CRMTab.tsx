import { BaseSyntheticEvent, useRef, useState } from "react";
import styles from "./css/crm.module.css";
import {
    Button,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import UploadIcon from '@mui/icons-material/Upload';
import { fetchData } from "../utility";

export default function CRMTab() {
  const [search, setSearch] = useState<string>("");
  const [file, setFile] = useState<FormData | null>(null);
  const fileInputRef = useRef(null);

  function handleChange(e: BaseSyntheticEvent) {
    setSearch(e.target.value);
  }

  function handleUpload() {
      if(fileInputRef.current){
        fileInputRef.current.click();
    }
  }

  function handleFileChange(e: BaseSyntheticEvent) {
    // setFile(e.target.files[0]);
    uploadData(e.target.files[0]);
  }

  async function uploadData(file: FormData){
    try {
      console.log(file);
      const formData = new FormData();
      formData.append('employees-data', file);
      const res = await fetchData('/api/admin/upload', 'POST', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(formData, res);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div id={styles.content}>
      <div id={styles.topContainer}>
        <form id={styles.form}>
        <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
          <OutlinedInput
            id="outlined-adornment-weight"
            value={search}
            onChange={handleChange}
            startAdornment={<SearchIcon className={styles.searchIcon}/>}
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              "aria-label": "weight",
            }}
          />
        </FormControl>
        <Button variant="contained" type="submit">Search</Button>
        </form>
        <Button onClick={handleUpload} startIcon={<UploadIcon />}>Upload File</Button>
        <input type="file" onChange={handleFileChange} name="employees" id="fileInput" ref={fileInputRef} hidden={true}/>
        {/* <TextField type="file" variant="outlined" ref={fileInputRef} /> */}
      </div>
    </div>
  );
}
