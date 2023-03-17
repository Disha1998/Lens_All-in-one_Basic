import React, { useEffect, useState } from 'react'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, TextField } from "@mui/material";
import { styled } from "@mui/system";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { create } from 'ipfs-http-client';
import createProfile from "./create-profile"
import { Buffer } from 'buffer';
import { LensAuthContext } from '../../context/LensContext';
// import { toast } from "react-toastify";

const auth =
    "Basic " +
    Buffer.from(
        process.env.REACT_APP_INFURA_PROJECT_KEY + ":" + process.env.REACT_APP_INFURA_APP_SECRET_KEY
    ).toString("base64");

const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
        authorization: auth,
    },
});
export default function CreateProfileModal() {

  const lensAuthContext = React.useContext(LensAuthContext);
  const {  loginCreate,   update, setUpdate, userAdd } = lensAuthContext;
    
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState("");
    const [handle, setHandle] = useState("");
    const [isLoading, setIsLoading] = useState(false);


   const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const ipfsResult = await client.add(file);
    const imageURI = `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`;
    setFile(imageURI);
  }
  const handleSubmit = async (event) => {

    setIsLoading(true);
    const handleData = {
      handle: handle,
      url: file,
      address: userAdd,
      login: loginCreate
    }
    const result = await createProfile(handleData);

    if (result === false) {
      setIsLoading(false);
    } else {
      setUpdate(!update);
      setIsLoading(false);
    }
    setOpen(false); 
    return true;
  };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>            <h1>Create Profile</h1>
            <div>
                <div>
                    <Button variant="contained" onClick={handleClickOpen} >Create Lens Profile</Button>
                </div>
                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogTitle>Create Profile</DialogTitle>                    <DialogContent>
                        <div className="flex items-center mt-2" style={{ border: '1px solid grey', borderRadius: '6px' }}>                         <input
                            onChange={(e) => handleUploadImage(e)}
                            type="file"
                            name="file"
                            id="file"
                            className="input-file d-none" />                            <label
                                htmlFor="file"
                                style={{ width: '100%', cursor: 'pointer' }}
                                className="rounded-3 text-center    js-labelFile p-2 my-2 w-20  "
                            >
                                <CloudUploadIcon />
                                <p className="js-fileName">                             Upload Profile(PNG, JPG, GIF)
                                </p>
                            </label></div>
                        <TextField
                            onChange={(e) => setHandle(e.target.value)}
                            className='my-2' id="outlined-basic" label="Handle" variant="outlined" fullWidth placeholder='@handle' />
                    </DialogContent>                    <DialogActions>
                        <Button
                            onClick={handleClose}
                            variant="contained">Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                        >  "Create Profile"</Button>
                    </DialogActions>
                </Dialog>
            </div>        </>)
}