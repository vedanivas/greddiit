import * as React from 'react'
import Grid from '@mui/material/Grid';
import Form from "./CreateSubgreddiitForm"

export default function CreateSubgreddiit(props) {
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