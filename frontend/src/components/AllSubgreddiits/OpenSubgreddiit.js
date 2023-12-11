import * as React from "react";
import { useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import SubgreddiitCard from "../Subgreddiit/SubgreddiitCard";
import CreatePost from "../Posts/CreatePost";
import Post from "../Posts/Post";
import { List, ListItem } from "@mui/material";
import axios from "axios";
import Root from "../../url";

export default function OpenSubgreddiit() {

    const user_id = JSON.parse(window.localStorage.getItem("user-details"))._id

    const { subgreddiitID } = useParams()

    const [data, setData] = React.useState([])
    const [posts, setPosts] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        async function getData() {
            try {
                const url = Root() + "/subgreddiits/" + subgreddiitID
                const config = { 'content-type': 'application/json' }
                const response = await axios.post(url, {id: user_id}, config)
                if (response.data.status === "OK") {
                    setData(response.data.subg)
                    setPosts(response.data.posts)
                    setIsLoading(false)
                }
                else console.log("Problem")
            } catch (error) {
                console.log(error.response.data)
            }
        }
        getData()
    }, [])

    const add = (info) => {
                setPosts((prevArray) => {
                    return [...prevArray, {post: info, upvoted: false, downvoted: false, following: true, saved: false}]
                })
    }

    const ups = async (info) => {
        try {
            const url = Root() + "/ups/" + info.post_id
            const config = { 'content-type': 'application/json' }
            const response = await axios.post(url, {id: user_id, upstat: info.upstat}, config)
            if (response.data.status === "OK") {
                console.log("OK")
            }
            else if (response.data.status === "NOK"){
                console.log("NOK")
            }
            else console.log("Problem")
        } catch (error) {
            console.log(error.response.data)
        }
    }

    const downs = async (info) => {
        try {
            const url = Root() + "/downs/" + info.post_id
            const config = { 'content-type': 'application/json' }
            const response = await axios.post(url, {id: user_id, downstat: info.downstat}, config)
            if (response.data.status === "OK") {
                console.log("OK")
            }
            else if (response.data.status === "NOK"){
                console.log("NOK")
            }
            else console.log("Problem")
        } catch (error) {
            console.log(error.response.data)
        }
    }

    const follow = async (o_user_id) => {
        try {
            const url = Root() + "/follow"
            const config = { 'content-type': 'application/json' }
            const response = await axios.post(url, {my_id: user_id, o_id: o_user_id}, config)
            if (response.data.status === "OK") {
                console.log("OK")
                // setPosts((prevArray) => {
                //     return [...prevArray]
                // })
            }
            else console.log("Problem")
        } catch (error) {
            console.log(error.response.data)
        }
    }

    const save = async (info) => {
        try {
            const url = Root() + "/save"
            const config = { 'content-type': 'application/json' }
            const response = await axios.post(url, {id: user_id, post_id: info.post_id}, config)
            if (response.data.status === "OK") {
                console.log("OK")
            }
            else console.log("Problem")
        } catch (error) {
            console.log(error.response.data)
        }
    }

    if (isLoading) return <h1>Loading...</h1>
    else return (
        <Box sx={{ my: 2, mx: 4 }}>
            <CreatePost add={add}/>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="flex-start"
                spacing={2}
            >
                <Grid item xs={4}>
                    <SubgreddiitCard opened="true" name={data.name} description={data.description} />
                </Grid>
                <Grid item xs={8} sx={{pr: 2}}>
                <Paper elevation={0} style={{ maxHeight: 600, overflow: 'auto' }}>
                    <List component="div" disablePadding>
                        {posts && posts.map((each) => {
                            console.log(each)
                            return (
                                <ListItem>
                                    <Post 
                                    info={each}
                                    ups={ups}
                                    downs={downs}
                                    follow={follow}
                                    save={save}
                                    where="subgreddiit"
                                    />
                                </ListItem>
                            )
                        })}
                    </List>
                </Paper>
                </Grid>
            </Grid>
        </Box>

    );
}