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
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import Root from "../../url";

export default function CreatePostForm(props) {

    const { subgreddiitID } = useParams()

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
            user: JSON.parse(window.localStorage.getItem("user-details")),
            content: data.get("post"),
            upvotes: [],
            downvotes: [],
        }
        try{
            const url = Root() + "/createpost/" + subgreddiitID
            const config = { 'content-type': 'application/json' }
            const response = await axios.post(url, info, config)
            if (response.data.status === "OK"){
                props.add(response.data.info)
            }
        } catch(error){
            console.log(error.response.data)
        }

        handleClose()
        // navigate("/subgreddiits/" + subgreddiitID)
    };

    return (
        <>
            <IconButton edge="end" aria-label="delete" color="inherit" onClick={handleClickOpen} >
                    <AddCircleIcon style={{ color: "black" }} sx={{ fontSize: 40 }} />
                </IconButton>
            <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
                <DialogTitle>Create New Post</DialogTitle>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 0 }}>
                <DialogContent>
                        <Grid container>
                            <Grid item sm>
                                <TextField
                                    required
                                    fullWidth
                                    name="post"
                                    id="post"
                                    label="Post"
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