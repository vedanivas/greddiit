import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export default function SubgreddiitCard(props) {

  const navigate = useNavigate()

  const user = JSON.parse(window.localStorage.getItem("user-details"))

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image="https://picsum.photos/345/140"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.description}
        </Typography>
      </CardContent>

      {
        (props.opened === "false") &&
        <CardActions>
          {
            (props.role === "moderator")
              ?
              <>
                <Button size="small" onClick={() => { navigate("/my-subgreddiits/" + props.uni) }}>Open</Button>
                <Button size="small" onClick={() => { props.del(props.uni) }}>Delete</Button>
              </>
              :
              <>
                {
                  (props.joinStatus === "true")
                    ?
                    <>
                      <Button size="small" onClick={() => { navigate("/subgreddiits/" + props.uni) }}>Open</Button>
                      <Button size="small" disabled={(props.joinType === "moderator")} onClick={() => { props.leave({ user: user, subgreddiit_id: props.uni }) }}>Leave</Button>
                    </>
                    :
                    <>
                      <Button size="small" onClick={() => { props.request({ user: user, subgreddiit_id: props.uni }) }}>Join</Button>
                    </>
                }
              </>
          }
        </CardActions>
      }
    </Card>
  );
}