import * as React from 'react'
import { Box } from '@mui/system'
import Grid from '@mui/material/Grid';
import Search from './Search'
import SubgreddiitCard from '../Subgreddiit/SubgreddiitCard'
import Tags from "./Tags";
import axios from "axios";
import Root from "../../url";
import { useNavigate } from 'react-router-dom';

export default function DisplaySubgreddiits() {
    const id = JSON.parse(window.localStorage.getItem("user-details"))._id

    const [allSubgreddiits, setAllSubgreddiits] = React.useState([])
    const [tags, setTags] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)

    const navigate = useNavigate()

    React.useEffect(() => {
        async function getData() {
            try {
                const url = Root() + "/allsubgreddiits"
                const response = await axios.get(url)
                if (response.data.status === "OK") {
                    setAllSubgreddiits(response.data.info)

                    response.data.info.map((each) => {
                        setTags((prevArray) => {
                            return [...prevArray, ...each.banned]
                        })
                    })
                    setIsLoading(false)
                }
                else console.log("Problem")
            } catch (error) {
                console.log(error.response.data)
            }
        }
        getData()
    }, [])

    const request = async (ids) => {
        try {
            const url = Root() + "/joinrequest"
            const config = { 'content-type': 'application/json' }
            const response = await axios.post(url, ids, config)
            if (response.data.status === "OK") console.log("Very good")
            else console.log("Bad")
        } catch (error) {
            console.log(error.response.data)
        }
    }

    const leave = async (ids) => {
        try {
            const url = Root() + "/leave"
            const config = { 'content-type': 'application/json' }
            const response = await axios.post(url, ids, config)
            if (response.data.status === "OK") console.log("Very good")
            else console.log("Bad")

            window.location.reload()

        } catch (error) {
            console.log(error.response.data)
        }
    }

    if (isLoading) return <h1>Loading...</h1>
    else return (
        <Box sx={{ my: 2, mx: 4 }}>
            <Search />
            <Grid container spacing={2}>
                {tags.map((each) => {
                    return (
                        <Grid item>
                            <Tags tag={each} />
                        </Grid>
                    )
                })}
            </Grid>
            <Grid container spacing={2}>
                {allSubgreddiits.map((card) => {
                    let joinStatus = "false"
                    let joinType = "user"
                    if (card.moderator === id) joinType = "moderator"
                    card.members.map((member) => {
                        if (member._id === id) joinStatus = "true"
                    })

                    return (
                        <Grid item xs={3} sx={{ my: 2 }}>
                            <SubgreddiitCard
                                key={card._id}
                                uni={card._id}
                                name={card.name}
                                description={card.description}
                                role="user"
                                opened="false"
                                joinStatus={joinStatus}
                                joinType={joinType}
                                del={() => { alert("Not Working") }}
                                request={request}
                                leave={leave}
                            />
                        </Grid>
                    )
                })}
            </Grid>
        </Box>


    )
}