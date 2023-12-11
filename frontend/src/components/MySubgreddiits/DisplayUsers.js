import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ShieldIcon from '@mui/icons-material/Shield';
import PersonIcon from '@mui/icons-material/Person';
import BlockIcon from '@mui/icons-material/Block';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from "axios";
import Root from "../../url"

export default function DisplayUsers() {

    const { subgreddiitID } = useParams()

    const [users, setUsers] = React.useState({ moderator: [], others: [] })
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        async function getData() {
            try {
                const url = Root() + "/my-subgreddiits/" + subgreddiitID
                const response = await axios.get(url)
                if (response.data.status === "OK") {
                    setUsers(response.data.info)
                    setIsLoading(false)
                }
                else console.log("Problem")
            } catch (error) {
                console.log(error.repsonse.data)
            }
        }
        getData()
    }, [])

    const [open, setOpen] = React.useState(false);
    const [openb, setOpenb] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    const handleClickb = () => {
        setOpenb(!openb);
    };

    if (isLoading) return <h1>Loading....</h1>
    else return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Members of the Subgreddiit
                </ListSubheader>
            }
        >
            <ListItemButton>
                <ListItemIcon>
                    <ShieldIcon />
                </ListItemIcon>
                <ListItemText primary={users.moderator[0].uname} />
            </ListItemButton>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Other Users" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Paper elevation={0} style={{ maxHeight: 200, overflow: 'auto' }}>
                    {users.others.map((each) => {
                        return (
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemIcon />
                                    <ListItemText primary={each.uname} />
                                </ListItemButton>
                            </List>)
                    })}
                </Paper>
            </Collapse>
            <ListItemButton onClick={handleClickb}>
                <ListItemIcon>
                    <BlockIcon />
                </ListItemIcon>
                <ListItemText primary="Blocked Users" />
                {openb ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openb} timeout="auto" unmountOnExit>
                <Paper elevation={0} style={{ maxHeight: 200, overflow: 'auto' }}>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon />
                            <ListItemText primary="Starred" />
                        </ListItemButton>
                    </List>
                </Paper>
            </Collapse>
        </List>
    );
}