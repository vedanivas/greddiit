import * as React from 'react'; 
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CreateSubgreddiit from '../AllSubgreddiits/CreateSubgreddiit';
import SubgreddiitCard from "../Subgreddiit/SubgreddiitCard"
import axios from "axios";
import Root from "../../url";

export default function DisplayMySubgreddiit() {
    const [array, setArray] = React.useState([{}])

    const id = JSON.parse(window.localStorage.getItem("user-details"))._id

    React.useEffect(() => {
        async function getData() {
            try {
                const url = Root() + "/allmysubgreddiits"
                const config = { 'content-type': 'application/json' }
                const response = await axios.post(url, { id: id }, config)
                if (response.data.status === "OK") setArray(response.data.info)
                else console.log("Problem")
            } catch (error) {
                console.log(error.response.data)
            }
        }
        getData()
    }, [])

    function add(card) {
        setArray((prevArray) => {
            return [...prevArray, card];
          });
    }

    async function del(id) {
        try {
            const url = Root() + "/delsubgreddiit"
            const config = { 'content-type': 'application/json' }
            const response = await axios.post(url, {id: id}, config)
            if (response.data === "ok") {
                setArray((prevArray) => {
                    return prevArray.filter((card) => {
                      return card._id !== id;
                    });
                  });
            }
            else console.log("Problem")
        } catch (error){
            console.log(error.response.data)
        }
    }

    return (
        <Box sx={{ my: 2, mx: 4 }}>
            <CreateSubgreddiit add={add}/>
            <Grid container spacing={2}>
                {array.map((card) => {
                    return (
                        <Grid item xs={3} sx={{my: 2}}>
                            <SubgreddiitCard
                                key={card._id}
                                uni={card._id}
                                name={card.name}
                                description={card.description}
                                role="moderator"
                                joinStatus="true"
                                joinType="moderator"
                                opened="false"
                                del={del}
                            />
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}