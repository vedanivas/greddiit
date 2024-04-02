import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CommentIcon from '@mui/icons-material/Comment';
import Avatar from '@mui/material/Avatar';
import { green } from '@mui/material/colors';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import PostService from '../services/Posts';
import UserService from "../services/Users";
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
const theme = createTheme();
const Post = ({ id, post, posts, setposts }) => {
    console.log(post)
    const [Upvotes, setUpvotes] = useState(post.Upvotes);
    const [Downvotes, setDownvotes] = useState(post.Downvotes);
    const [Comments, setComments] = useState(post.Comments);
    const [newComment, setNewComment] = useState('');
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
        setComments([...Comments, { comment: newComment, commented: (JSON.parse(window.localStorage.getItem('token'))).id }]);
        setposts(posts.map(element => element._id === id ? {
            ...element,
            Comments: { comment: newComment, commented: (JSON.parse(window.localStorage.getItem('token'))).id }
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
        const RemoveSavedPosts = async () => {
            try {
                const data = await UserService.RemoveSavedPosts((JSON.parse(window.localStorage.getItem('token'))).id,
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
        RemoveSavedPosts();
        setposts(posts.filter(element => element._id!==post._id))
    }
    return (
        <div>
            <Container component="main" sx={{ maxWidth: 500 }}>
                <Card style={{ marginBottom: '20px' }} sx={{ marginTop: 8, bgcolor: green[500] }}>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {post.By.Username}
                        </Typography>
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
                            <IconButton aria-label="Save" onClick={handleSaveposts}>
                                <BookmarkRemoveIcon />
                            </IconButton>
                            <IconButton aria-label="Follow" onClick={handleFollow}>
                                <FollowTheSignsIcon />
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
        </div>
    );
};
const RedditClone = () => {
    const [posts, setposts] = React.useState([])
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await UserService.getID()
                console.log("recieved", data)
                setposts(data.SavedPosts)
                console.log("posts on Loading are", data.SavedPosts)
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, [])
    return (
        <div>
            <ThemeProvider theme={theme} sx={{ mt: 8 }}>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <BookmarksIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        SAVED POSTS
                    </Typography>
                </Box>
                {posts.map((post) => (
                    <Post key={post._id} id={post._id} post={post} posts={posts} setposts={setposts} />
                ))}
            </ThemeProvider>
        </div>
    );
};
export default RedditClone;