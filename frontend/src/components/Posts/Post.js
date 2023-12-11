import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red, green } from '@mui/material/colors';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RedditIcon from '@mui/icons-material/Reddit';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import AddCommentIcon from '@mui/icons-material/AddComment';
import PostMenu from './PostMenu';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Post(props) {
  const [expanded, setExpanded] = React.useState(false)
  const [upstat, setUpStat] = React.useState(props.info.upvoted)
  const [downstat, setDownStat] = React.useState(props.info.downvoted)

  const handleUps = () => {
    setUpStat((u) => !u)
    props.ups({post_id: props.info.post._id, upstat: upstat})
  }

  const handleDowns = () => {
    setDownStat((d) => !d)
    props.ups({post_id: props.info.post._id, downstat: downstat})
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ width: 1 }}>
      {props.info.subg && <CardHeader title={props.info.subg}/>}
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            <RedditIcon />
          </Avatar>
        }
        action={
          <PostMenu 
          following={props.info.following} 
          user_id={props.info.post.user._id}
          post_id={props.info.post._id}
          follow={props.follow}
          saved={props.info.saved}
          save={props.save}
          where={props.where}
          remove={props.remove}
          />
        }
        title={props.info.post.user.uname}
        subheader={props.info.post.user.fname + " " + props.info.post.user.lname}
      />
      <CardContent>
        <Typography paragraph variant="body2" color="text.secondary">
          {props.info.post.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={handleUps}>
        {
            upstat ? 
            <ArrowCircleUpIcon sx={{ color: green[700] }}/> :
            <ArrowCircleUpIcon />
          }
        </IconButton>
        <IconButton aria-label="add to favorites" onClick={handleDowns}>
          {
            downstat ? 
            <ArrowCircleDownIcon sx={{ color: red[500] }}/> :
            <ArrowCircleDownIcon />
          }
        </IconButton>
        <IconButton aria-label="share">
          <AddCommentIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
            aside for 10 minutes.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
