import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CommentIcon from '@mui/icons-material/Comment';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Avatar from '@mui/material/Avatar';
import { green } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PostService from '../services/Posts';
import UserService from "../services/Users"
import { useParams } from "react-router-dom";
import FlagIcon from '@mui/icons-material/Flag';
import ReportService from "../services/Report";
import SubGredditService from "../services/SubGreddiit"
const theme = createTheme();
var itemData = [
    {
        title: 'Breakfast',
        author: '@bkristastucchio',
        featured: true,
    }
];
const Post = ({ id, post, posts, setposts, blocked }) => {
    console.log(post)
    const params = useParams()
    const [Upvotes, setUpvotes] = useState(post.Upvotes);
    const [Downvotes, setDownvotes] = useState(post.Downvotes);
    const [Comments, setComments] = useState(post.Comments);
    const [newComment, setNewComment] = useState('');
    const [concern, setconcern] = React.useState("");
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setconcern("")
    };
    const handleUpvote = () => {
        const UpVoteData = async () => {
            try {
                const data = await PostService.UpdateUpvotes(id,
                    {
                        Upvotes: Upvotes + 1
                    }
                )
                console.log("recieved", data)

                console.log("posts on Loading are", posts)
            }
            catch (error) {
                console.log(error)
            }
        }
        UpVoteData();
        setUpvotes(Upvotes + 1);
        setposts(posts.map(element => element._id === id ? {
            ...element,
            Upvotes: element.Upvotes + 1
        } : element))
    };

    const handleDownvote = () => {
        const DownVoteData = async () => {
            try {
                const data = await PostService.UpdateDownvotes(id,
                    {
                        Downvotes: Downvotes + 1
                    }
                )
                console.log("recieved", data)

                console.log("posts on Loading are", posts)
            }
            catch (error) {
                console.log(error)
            }
        }
        DownVoteData();
        setDownvotes(Downvotes + 1)
        setposts(posts.map(element => element._id === id ? {
            ...element,
            Downvotes: element.Downvotes + 1
        } : element))
    };

    const handleComment = (event) => {
        event.preventDefault();
        const CommentData = async () => {
            try {
                const data = await PostService.UpdateComments(id,
                    {
                        Comments: [...Comments, { comment: newComment, commented: (JSON.parse(window.localStorage.getItem('token'))).id }]
                    }
                )
                console.log("recieved", data)
                console.log("posts on Loading are", posts)
            }
            catch (error) {
                console.log(error)
            }
        }
        CommentData();
        setComments([...Comments, {
            comment: newComment, commented: {
                Username: (JSON.parse(window.localStorage.getItem('token'))).Username
            }
        }]);
        setposts(posts.map(element => element._id === id ? {
            ...element,
            Comments: {
                comment: newComment, commented: {
                    Username: (JSON.parse(window.localStorage.getItem('token'))).Username
                }
            }
        } : element))
        setNewComment('');
    };
    const handleFollow = (event) => {
        event.preventDefault();
        const HandleFollowing = async () => {
            try {
                const data = await UserService.AddFollowing((JSON.parse(window.localStorage.getItem('token'))).id,
                    {
                        TargetID: post.By._id
                    }
                )
                console.log("recieved", data)
                console.log("I want to follow him", post.By._id)
            }
            catch (error) {
                console.log(error)
            }
        }
        HandleFollowing();
    }
    const handleSaveposts = (event) => {
        const HandleSavedPosts = async () => {
            try {
                const data = await UserService.AddSavedPosts((JSON.parse(window.localStorage.getItem('token'))).id,
                    {
                        PostID: post._id
                    }
                )
                console.log("recieved", data)
                console.log("I want to follow him", post.By._id)
            }
            catch (error) {
                console.log(error)
            }
        }
        HandleSavedPosts();
    }
    const handleReport = (event) => {
        console.log("This is post", post)
        const HandleReports = async () => {
            try {
                const data = await ReportService.create({
                    Concern: concern,
                    Post: post._id,
                    By: JSON.parse(window.localStorage.getItem('token')).id,
                    On: post.By._id,
                    date: new Date(),
                    SubGredditID: params.id
                }
                )
                console.log("recieved", data)
                console.log("Report Him", post.By._id)
            }
            catch (error) {
                console.log(error)
            }
        }
        HandleReports();
        setOpen(false);
    }
    return (
        <div>
            <Container component="main" sx={{ maxWidth: 500 }}>
                <Card style={{ marginBottom: '20px' }} sx={{ marginTop: 8, bgcolor: green[500] }}>
                    <CardContent>
                        {blocked ?
                            <Typography variant="h5" component="h2">
                                Blocked User
                            </Typography> :
                            <Typography variant="h5" component="h2">
                                {post.By.Username}
                            </Typography>
                        }
                        <Typography variant="body2" component="p">
                            {post.Text}
                        </Typography>
                        <div>
                            <IconButton aria-label="upvote" onClick={handleUpvote}>
                                <ThumbUpIcon />
                            </IconButton>
                            {post.Upvotes}
                            <IconButton aria-label="downvote" onClick={handleDownvote}>
                                <ThumbDownIcon />
                            </IconButton>
                            {post.Downvotes}
                            {
                                (JSON.parse(window.localStorage.getItem('token'))).SavedPosts.map(element => element._id).includes(JSON.parse(window.localStorage.getItem('token')).id) ?
                                    <IconButton aria-label="Save" disabled>
                                        <BookmarkAddIcon />
                                    </IconButton>
                                    :
                                    <IconButton aria-label="Save" onClick={handleSaveposts}>
                                        <BookmarkAddIcon />
                                    </IconButton>
                            }
                            <IconButton aria-label="Follow" onClick={handleFollow}>
                                <FollowTheSignsIcon />
                            </IconButton>
                            <IconButton aria-label="Follow" onClick={handleClickOpen}>
                                <FlagIcon />
                            </IconButton>
                        </div>
                        <div style={{
                            marginTop: '20px',
                            marginBottom: '10px'
                        }}>
                            <form onSubmit={handleComment}>
                                <TextField
                                    id="outlined-basic"
                                    label="Leave a comment"
                                    variant="outlined"
                                    value={newComment}
                                    onChange={(event) => setNewComment(event.target.value)}
                                    required
                                />
                                <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                                    <CommentIcon />
                                </IconButton>
                            </form>
                        </div>
                        <div>
                            {Comments.map((comment) => (
                                <Typography key={comment} variant="body2" component="p">
                                    {comment.comment} by {comment.commented.Username}
                                </Typography>
                            ))}
                        </div>
                    </CardContent>
                </Card >
            </Container>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Report</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To Report this post in the SubGreddit, enter your Concern.
                        All the Reports are text based only
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Concern"
                        fullWidth
                        variant="standard"
                        value={concern}
                        onChange={event => setconcern(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    {
                        concern ?
                            <Button onClick={handleReport}>REPORT THIS POST</Button>
                            :
                            <Button disabled>REPORT THIS POST</Button>
                    }
                </DialogActions>
            </Dialog>
        </div>
    );
};

function srcset(image, width, height, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${Number(width) * Number(cols)}&h=${Number(height) * Number(rows)}&fit=crop&auto=format`,
        srcSet: `${image}?w=${Number(width) * Number(cols)}&h=${Number(height) * Number(rows)
            }&fit=crop&auto=format&dpr=2 2x`,
    };
}
const RedditClone = () => {
    const params = useParams()
    const [posts, setposts] = React.useState([])
    const [open, setOpen] = useState(false);
    const [Text, setText] = useState("")
    const [subgreddit, setsubgreddit] = React.useState({})
    const [showbuttons, setshowbuttons] = React.useState({
        showpostthisbutton: true,
        showcreatepostbutton: true
    })
    var [url_image, seturl_image] = useState("https://images.unsplash.com/photo-1551963831-b3b1ca40c98e")
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setText("")
    };
    const handlePost = () => {
        setshowbuttons({ ...showbuttons, showcreatepostbutton: false, showpostthisbutton: false })
        var inputLowerCase = Text.toLowerCase();
        let containsBannedWord = false;
        console.log("Banned Keywords are", subgreddit.Banned)
        subgreddit.Banned.forEach(word => {
            if (inputLowerCase.includes(word.toLowerCase())) {
                containsBannedWord = true;
                console.log("Before split", inputLowerCase)
                inputLowerCase = inputLowerCase.split(word.toLowerCase()).join("*".repeat(word.length));
                console.log("After split", inputLowerCase)
            }
        });
        if (containsBannedWord) {
            alert("Your post contains banned keywords, they have been replaced with asterisks.");
            setText(inputLowerCase);
            console.log("Before posting", inputLowerCase)
            const PostData = async () => {
                try {
                    const data = await PostService.create(
                        {
                            Text: inputLowerCase,
                            By: (JSON.parse(window.localStorage.getItem('token'))).id,
                            In: params.id,
                            date: new Date()
                        }
                    )
                    console.log("recieved", data)
                    setposts([...posts, {
                        ...data, By: JSON.parse(window.localStorage.getItem('token'))
                    }])
                    console.log("By", JSON.parse(window.localStorage.getItem('token')))
                    console.log("posts on Loading are", posts)
                }
                catch (error) {
                    console.log(error)
                }

            }
            PostData();
            setText("")
        }
        else {
            const PostData = async () => {
                try {
                    const data = await PostService.create(
                        {
                            Text: Text,
                            By: (JSON.parse(window.localStorage.getItem('token'))).id,
                            In: params.id,
                            date: new Date()
                        }
                    )
                    console.log("recieved", data)
                    setposts([...posts, {
                        ...data, By:
                            JSON.parse(window.localStorage.getItem('token'))

                    }])
                    console.log("By", JSON.parse(window.localStorage.getItem('token')))
                    console.log("posts on Loading are", posts)
                }
                catch (error) {
                    console.log(error)
                }
            }
            PostData();
            setText("")
        }
        setshowbuttons({ ...showbuttons, showcreatepostbutton: true, showpostthisbutton: true })
        setOpen(false);
    };
    React.useEffect(() => {
        const fetchSubGreddit = async () => {
            try {
                const data = await SubGredditService.getid(params.id)
                setsubgreddit(data)
                console.log("set subgreddit to", data)
                if (data.ImageURL) {
                    seturl_image(data.ImageURL)
                }
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchSubGreddit();
    }, [])
    React.useEffect(() => {
        const fetchposts = async () => {
            try {
                const data = await PostService.getSubGredditID(params.id)
                console.log("posts recieved", data)
                setposts(data.map(element => {
                    return {
                        ...element,
                        Text: element.Text,
                        By: element.By,
                        In: element.In,
                        Upvotes: element.Upvotes,
                        Downvotes: element.Downvotes,
                        Comments: element.Comments,
                    }
                }))
                console.log("posts on Loading are", posts)
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchposts();
    }, [])
    return (
        <div>
            <ThemeProvider theme={theme} sx={{ mt: 8 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        p: 1,
                        m: 1,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        justifyContent: 'space-between',
                    }}
                >
                    <ImageList
                        sx={{
                            width: 500,
                            height: 450,
                            // Promote the list into its own layer in Chrome. This costs memory, but helps keeping high FPS.
                            transform: 'translateZ(0)',
                            mt: 8
                        }}
                        rowHeight={200}
                        gap={1}
                    >{itemData.map((item) => {
                        const cols = item.featured ? 2 : 1;
                        const rows = item.featured ? 2 : 1;

                        return (
                            <ImageListItem key={item.img} cols={cols} rows={rows}>
                                <img
                                    {...srcset(url_image, 250, 200, rows, cols)}
                                    alt={item.title}
                                    loading="lazy"
                                />
                                <ImageListItemBar
                                    sx={{
                                        background:
                                            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                    }}
                                    title={`Name: ${subgreddit.Name}`}
                                    position="top"
                                    actionIcon={
                                        <IconButton
                                            sx={{ color: 'white' }}
                                            aria-label={`star ${subgreddit.Name}`}
                                        >
                                            <StarBorderIcon />
                                        </IconButton>
                                    }
                                    actionPosition="left"
                                />
                                <ImageListItemBar
                                    title={<span> Description: {subgreddit.Description}</span>}
                                    position="below"
                                />
                            </ImageListItem>
                        );
                    })}
                    </ImageList>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <PostAddIcon />
                        </Avatar>
                        {
                            showbuttons.showcreatepostbutton ?
                                <Button variant="contained" color="secondary" onClick={handleClickOpen}>CREATE POST</Button>
                                :
                                <Button variant="contained" color="secondary" disabled >CREATE POST</Button>
                        }

                    </Box>
                </Box>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>POST</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To POST to this SubGreddit, enter Text for the concerned POST.
                            All the Posts are text based only
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Text"
                            fullWidth
                            variant="standard"
                            value={Text}
                            onChange={event => setText(event.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        {
                            Text && showbuttons.showpostthisbutton ?
                                <Button onClick={handlePost}>POST THIS</Button>
                                :
                                <Button disabled>POST THIS</Button>
                        }
                    </DialogActions>
                </Dialog>
                {posts.map((post) =>
                    subgreddit.Blocked && subgreddit.Blocked.map(element => element._id).includes(post.By._id) && subgreddit.Moderator._id !== JSON.parse(window.localStorage.getItem('token'))._id ?
                        <Post key={post._id} blocked={true} id={post._id} post={post} posts={posts} setposts={setposts} />
                        :
                        <Post key={post._id} blocked={false} id={post._id} post={post} posts={posts} setposts={setposts} />

                )}
            </ThemeProvider>
        </div>
    );
};

export default RedditClone;
