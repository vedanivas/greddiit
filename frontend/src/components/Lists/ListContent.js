import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box } from '@mui/system';

export default function ListContent(props) {

  const actions = { del: <DeleteIcon />, nope: <CancelIcon />, yes: <CheckCircleIcon /> }

  return (
    <ListItem alignItems="flex-start"
      secondaryAction={
        <Box>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
          {
            (props.title === "Requests") ?
            <>
            <Grid item sx={{ mx: 1 }}>
              <IconButton edge="end" aria-label="delete" onClick={() => {props.accept(props.uni)}}>
                <CheckCircleIcon />
              </IconButton>
            </Grid>
            <Grid item sx={{ mx: 1 }}>
              <IconButton edge="end" aria-label="delete" onClick={() => {props.decline(props.uni)}}>
                <CancelIcon />
              </IconButton>
            </Grid>
            </>
            :
            <Grid item sx={{ mx: 1 }}>
              <IconButton edge="end" aria-label="delete" onClick={() => {props.del({o_id: props.o_id, title: props.title, my_id: props.my_id})}}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          }
          </Grid>
        </Box>
      }>
      <ListItemAvatar>
        <Avatar src="/broken-image.jpg" />
      </ListItemAvatar>
      <ListItemText
        primary={props.uname}
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {props.fname + " " + props.lname}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  )
}