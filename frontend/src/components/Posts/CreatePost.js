import * as React from 'react'
import Grid from '@mui/material/Grid';
import Form from "./CreatePostForm"

export default function CreatePost(props) {
    return (
            <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="flex-start"
            >
                <Form add={props.add}/>
            </Grid>
    )
}