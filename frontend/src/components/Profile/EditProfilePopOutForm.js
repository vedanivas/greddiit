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
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Root from "../../url";

export default function FormDialog() {
    const [open, setOpen] = React.useState(false);

    const [info, setInfo] = React.useState({})

    const navigate = useNavigate()

    const handleClickOpen = () => {
        setOpen(true);
    setInfo(JSON.parse(window.localStorage.getItem("user-details")))
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const info = {
            _id : JSON.parse(window.localStorage.getItem("user-details"))._id,
            fname: data.get("firstName"),
            lname: data.get("lastName"),
            uname: data.get("uname"),
            email: data.get("email"),
            age: data.get("age"),
            contact: data.get("contact"),
            password: data.get("password")
        }
        try{
            const url = Root() + "/editprofile"
            const config = { 'content-type': 'application/json' }
            const response = await axios.post(url, info, config)
            if (response.data.status === "ok"){
                window.localStorage.setItem("user-details", JSON.stringify(response.data.details))
            }


        } catch(error){
            console.log(error.response.data)
        }

        handleClose()
        navigate("/profile")
    };

    return (
        <>
            <IconButton edge="end" aria-label="delete" color="inherit" onClick={handleClickOpen} >
                <EditIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit</DialogTitle>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 0 }}>
                <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    defaultValue={info.fname}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    defaultValue={info.lname}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="uname"
                                    label="Username"
                                    name="uname"
                                    autoComplete="username"
                                    defaultValue={info.uname}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    defaultValue={info.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    autoComplete="false"
                                    name="age"
                                    fullWidth
                                    id="age"
                                    label="Age"
                                    defaultValue={info.age}
                                />
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <TextField
                                    autoComplete="tel"
                                    name="contact"
                                    fullWidth
                                    id="contact"
                                    label="Contact"
                                    defaultValue={info.contact}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="text"
                                    id="password"
                                    autoComplete="new-password"
                                    defaultValue={info.password}
                                />
                            </Grid>
                        </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Submit</Button>
                </DialogActions>
                    </Box>
            </Dialog>
        </>
    );
}