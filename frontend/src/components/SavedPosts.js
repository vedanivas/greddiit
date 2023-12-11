import * as React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Post from "./Posts/Post";
import { List, ListItem } from "@mui/material";
import axios from "axios";
import Root from "../url";

export default function SavedPosts() {

    const [list, setList] = React.useState()
    const [isLoading, setIsLoading] = React.useState(true)

    const id = JSON.parse(window.localStorage.getItem("user-details"))._id

    React.useEffect(() => {
        async function getData() {
            try {
                const url = Root() + "/savedposts/" + id
                const response = await axios.get(url)
                if (response.data.status === "OK") {
                    setList(response.data.posts)
                    setIsLoading(false)
                }
                else console.log("Problem")
            } catch (error) {
                console.log(error.response.data)
            }
        }
        getData()
    }, [])

    const ups = async (info) => {
        try {
            const url = Root() + "/ups/" + info.post_id
            const config = { 'content-type': 'application/json' }
            const response = await axios.post(url, {id: id, upstat: info.upstat}, config)
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
            const response = await axios.post(url, {id: id, downstat: info.downstat}, config)
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
            const response = await axios.post(url, {my_id: id, o_id: o_user_id}, config)
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

    const remove = async (post_id) => {
        try {
            const url = Root() + "/unsave/" + id
            const config = { 'content-type': 'application/json' }
            const response = await axios.post(url, {post_id: post_id}, config)
            if (response.data.status === "OK") {
                console.log("OK")
                setList((prevArray) => {
                    prevArray.filter((each) => each.post_id !== post_id)
                })
            }
            else console.log("Problem")
        } catch (error) {
            console.log(error.response.data)
        }
    }

    if (isLoading) return (<h1>Loading...</h1>)
    else return (
        <List component="div" disablePadding>
                        {list && list.map((each) => {
                            console.log(each)
                            return (
                                <ListItem>
                                    <Post 
                                    info={each}
                                    ups={ups}
                                    downs={downs}
                                    follow={follow}
                                    where="saved"
                                    remove={remove}
                                    />
                                </ListItem>
                            )
                        })}
        </List>
    )
}