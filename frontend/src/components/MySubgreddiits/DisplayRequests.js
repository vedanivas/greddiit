import * as React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListContent from '../Lists/ListContent';
import { useParams } from 'react-router-dom';
import axios from "axios";
import Root from "../../url";

export default function DisplayRequests() {   

    const { subgreddiitID } = useParams()
    const [requests, setRequests] = React.useState([])

    React.useEffect(() => {
        async function getData() {
            try {
                const url = Root() + "/requests/" + subgreddiitID
                const response = await axios.get(url)
                if (response.data.status === "OK") {
                    setRequests(response.data.info)
                }
                else console.log("Problem")
            } catch (error) {
                console.log(error.response.data)
            }
        }
        getData()
    }, [])

    const accept = async (user_id) => {
        try {
            const url = Root() + "/acceptance/" + subgreddiitID
            const config = { 'content-type' : 'application/json' }
            const response = await axios.post(url, {user_id: user_id}, config)
            if (response.data.status === "OK") setRequests(response.data.info)
            else console.log("Problem")

        } catch (error) {
            console.log(error.response.data)
        }
    }

    const decline = async (user_id) => {
        try {
            const url = Root() + "/decline/" + subgreddiitID
            const config = { 'content-type' : 'application/json' }
            const response = await axios.post(url, {user_id: user_id}, config)
            if (response.data.status === "OK") setRequests(response.data.info)
            else console.log("Problem")
            
        } catch (error) {
            console.log(error.response.data)
        }
    }


  return (
    <List sx={{ pt: 0 }}>
        
        {requests.map((each) => {
            return(
            <>
            <ListContent 
                key={each._id}
                uni={each._id}
                fname={each.fname} 
                lname={each.lname} 
                uname={each.uname}
                accept={accept}
                decline={decline} 
                title="Requests"
            />
            <Divider variant="inset" component="li" />
            </>
            )
        })}
    </List>
  );
}