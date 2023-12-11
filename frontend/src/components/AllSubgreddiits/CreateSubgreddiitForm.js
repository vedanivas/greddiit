import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Root from "../../url";

export default function CreateSubgreddiitForm(props) {
    const [open, setOpen] = React.useState(false);

    const navigate = useNavigate()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const info = {
            moderator: JSON.parse(window.localStorage.getItem("user-details")),
            name: data.get("name"),
            description: data.get("description"),
            banned: data.get("banned"),
        }
        console.log(info)
        try{
            const url = Root() + "/createsubgreddiit"
            const config = { 'content-type': 'application/json' }
            const response = await axios.post(url, info, config)
            if (response.data.status === "ok"){
                props.add(response.data.info)
            }
        } catch(error){
            console.log(error.response.data)
        }

        handleClose()
        navigate("/my-subgreddiits")
    };

    return (
        <>
            <IconButton edge="end" aria-label="delete" color="inherit" onClick={handleClickOpen} >
                    <AddCircleIcon style={{ color: "black" }} sx={{ fontSize: 40 }} />
                </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Subgreddiit</DialogTitle>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 0 }}>
                <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="name"
                                    id="name"
                                    label="Name"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="description"
                                    id="description"
                                    label="Description"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="banned"
                                    id="banned"
                                    label="Banned Keywords"
                                />
                            </Grid>
                        </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Create</Button>
                </DialogActions>
                    </Box>
            </Dialog>
        </>
    );
}