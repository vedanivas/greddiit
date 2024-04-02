import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import SubGredditService from "../services/SubGreddiit"
import Button from '@mui/material/Button';
import { useParams } from "react-router-dom";
import ReportService from "../services/Report";
import PostService from "../services/Posts"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { green } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, BarElement, Legend, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';
ChartJS.register(
    Title, Tooltip, BarElement, Legend,
    CategoryScale, LinearScale, PointElement, Filler
)
const theme = createTheme();
var EXPIRE = 10 * 86400 * 1000
function ChartPlot(params) {
    // console.log("entry", params)
    const data = {
        title: {
            text: params.title
        },
        labels: params.labels,
        datasets: [
            {
                data: params.data,
                tension: 0,
                fill: true,
                pointBorderColor: '#00000090',
                pointBackgroundColor: '#00000090',
                showLine: true,
                radius: 0.5,
                borderColor: "#000000",
                linecolor: "black",
                borderColor: '#FF6384',
                backgroundColor: '#FFB1C1'
            },
        ]
    }
    const options = {
        plugins: {
            title: {
                display: true,
                text: params.title,
                padding: 15,
                font: {
                    size: 20
                }
            },
            legend: {
                display: false
            }
        },
        maintainAspectRatio: true
    }
    options.scales = null;
    return (
        <Bar data={data} options={options} ></Bar>
    );
}
const CancelButton = ({ HandleClick }) => {
    const [count, setCount] = React.useState(3);
    const [cancelled, setCancelled] = React.useState(true);
    React.useEffect(() => {
        let intervalId = null;
        if (cancelled) {
            setCount(3)
            return
        }
        else {
            if (!cancelled && count > 0) {
                intervalId = setTimeout(() => {
                    setCount(count - 1);
                }, 1000);
            } else {
                clearTimeout(intervalId);
                if (count === 0) {
                    setCount(3)
                    HandleClick();
                    setCancelled(!cancelled)
                }
            }
            return () => clearTimeout(intervalId);
        }
    }, [count, cancelled, HandleClick]);
    const handleButtonClick = () => {
        if (cancelled) {
            setCount(3);
        }
        setCancelled(!cancelled);
    };
    return (
        <Button onClick={handleButtonClick} variant="contained" color="secondary">
            {cancelled ? "Block User" : `Cancel in ${count} secs`}
        </Button>
    );
};
export default function OpenSubGreddits(props) {
    const [open1, setOpen1] = React.useState(true);
    const [postgrowthData, setpostGrowthData] = React.useState([]);
    const [membergrowthData, setmembergrowthData] = React.useState([]);
    const [clickgrowthdata, setclickgrowthdata] = React.useState([])
    const [subgreddit, setsubgreddit] = React.useState({
        Name: "",
        Description: "",
        Tags: [],
        Banned: [],
        Moderator: null,
        Followers: [],
        Post: [],
        Reports: [],
        Followed: [],
        JoinRequests: [],
        Blocked: [],
        Reported: [],
        Clicks: [],
        PostGrowthData: [],
        ClickGrowthData: [],
        GrowthData: []
    });
    const [myreports, setmyreports] = React.useState([])
    const [open2, setOpen2] = React.useState(true);
    const [currentTab, setCurrentTab] = React.useState(0);
    const params = useParams()
    const handleClick1 = () => {
        setOpen1(!open1);
    };
    const handleClick2 = () => {
        setOpen2(!open2);
    };
    // TODO: Check whether if working for Graphs
    React.useEffect(() => {
        const fetchPostGrowth = async (data) => {
            try {
                const postdates = new Set();
                const postarray = data.PostGrowthData
                postarray.forEach((element, index) => {
                    postdates.add(element.date.substring(0, 10))
                })
                setpostGrowthData(Array.from(postdates).map(date => {
                    const posts = data.PostGrowthData.filter(subdata => subdata.date.substring(0, 10) === date).length;
                    return {
                        date: date,
                        posts: posts,
                    };
                }))
            }
            catch (error) {
                console.log(error)
            }
        }
        const MemberGrowth = async (data) => {
            try {
                const memberdates = new Set();
                data.GrowthData.forEach(element => memberdates.add(element.date.substring(0, 10)))
                console.log(data.GrowthData)
                setmembergrowthData(Array.from(memberdates).map(date => {
                    const members = data.GrowthData.filter(subdata => subdata.date.substring(0, 10) === date);
                    const joinmembers = members.filter(element => element.Join).length
                    console.log("element of postGrowth", {
                        date: date,
                        members: joinmembers
                    })
                    return {
                        date: date,
                        members: joinmembers
                    };
                }))
            }
            catch (error) {
                console.log(error)
            }
        }
        const ClickGrowth = async (data) => {
            try {
                const clickdates = new Set();
                console.log("ClickGrowthData", data.ClickGrowthData)
                data.ClickGrowthData.forEach(element => clickdates.add(element.substring(0, 10)))
                console.log("clickdates is", clickdates)
                setclickgrowthdata(Array.from(clickdates).map(date => {
                    const clicks = data.ClickGrowthData.filter(subdata => subdata.substring(0, 10) === date).length;
                    console.log("element of postGrowth", {
                        date: date,
                        clicks: clicks
                    })
                    return {
                        date: date,
                        clicks: clicks
                    };
                }))
            }
            catch (error) {
                console.log(error)
            }
        }
        const fetchReports = async (data) => {
            try {
                const data = await ReportService.getBySubGreddit(params.id)
                const currenttime = Date.now()
                const unexpiredreportdata = data.filter(element => (currenttime-element.creationdate < EXPIRE))
                console.log("unexpiredreportdata",unexpiredreportdata)
                setmyreports(unexpiredreportdata)
                console.log("Reports of the particular subgreddit on Loading are", data)
            }
            catch (error) {
                console.log(error)
            }
        }
        const fetchUsers = async () => {
            try {
                const data = await SubGredditService.getid(params.id)
                console.log("Received Subgreddit", data)
                setsubgreddit(
                    {
                        ...data,
                        Name: data.Name,
                        Description: data.Description,
                        Tags: data.Tags,
                        Banned: data.Banned,
                        Moderator: data.Moderator,
                        Followers: data.Followers,
                        Post: data.Post,
                        Reports: data.Reports,
                        date: data.date,
                        Followed: data.Followed,
                        JoinRequests: data.JoinRequests,
                        Blocked: data.Blocked,
                        Reported: data.Reported,
                        Clicks: data.Clicks
                    }
                )
                fetchPostGrowth(data)
                ClickGrowth(data)
                MemberGrowth(data)
                console.log("particular subgreddit on Loading are", subgreddit)
            }
            catch (error) {
                console.log(error)
            }
            fetchReports();
        }
        fetchUsers();
    }, [])
    function handleAccept(id1, id2) {
        console.log(id1, id2)
        const AcceptRequests = async () => {
            try {
                const data = await SubGredditService.AcceptRequest(id1, { UserID: id2 })
                console.log("recieved", data)
                // TODO: Is a change in UI required ? LIke doing setstate for any variable
            }
            catch (error) {
                console.log(error)
            }
            const updatedjoinrequests = subgreddit.JoinRequests.filter(element => element._id !== id2)
            const updatedFollowers = subgreddit.Followers.concat(id2)
            const updatedFollowed = subgreddit.Followed.concat(id2)
            setsubgreddit({ ...subgreddit, JoinRequests: updatedjoinrequests, Followers: updatedFollowers, Followed: updatedFollowed })
        }
        AcceptRequests();
    }
    function handleReject(id1, id2) {
        console.log(id1, id2)
        const RejectRequests = async () => {
            try {
                const data = await SubGredditService.RejectRequest(id1, { UserID: id2 })
                console.log("recieved", data)
                // TODO: Is a change in UI required ? LIke doing setstate for any variable
            }
            catch (error) {
                console.log(error)
            }
            const updatedjoinrequests = subgreddit.JoinRequests.filter(element => element._id !== id2)
            console.log("before",)
            console.log("after", updatedjoinrequests)
            setsubgreddit({ ...subgreddit, JoinRequests: updatedjoinrequests })
        }
        RejectRequests();
    }
    // ! Related to Reports Page
    function HandleDeletePost(postid, reportid, ReportOn, ReportBy) {
        // TODO: Check whether if working
        const UpdateSubGredditPost = async () => {
            try {
                const data = await SubGredditService.DeletePost(params.id, {
                    PostID: postid,
                    from: (JSON.parse(window.localStorage.getItem('token'))).Email,
                    ReportOnUsername: ReportOn.Username,
                    ReportedByUsername: ReportBy.Username,
                    ReportByEmail: ReportBy.Email,
                    ReportOnEmail: ReportOn.Email,
                    SubGredditName: subgreddit.Name
                })
                console.log("UpdatedSubGredditdata", data)
            }
            catch (error) {
                console.log(error)
            }
        }
        const UpdateSubGredditReport = async () => {
            try {
                const data = await SubGredditService.DeleteReport(params.id, {
                    ReportID: reportid
                })
                console.log("UpdatedSubGredditdata", data)
                const updatesubgredditreports = subgreddit.Reports.filter(element => element._id !== reportid)
                setsubgreddit({ ...subgreddit, Reports: updatesubgredditreports })
            }
            catch (error) {
                console.log(error)
            }
            UpdateSubGredditPost();
        }
        const DeleteReport = async () => {
            try {
                const data = await ReportService.Delete(reportid, params.id)
                console.log("recieved", data)
                const finalreports = myreports.filter(element => element._id !== reportid)
                setmyreports(finalreports)
            }
            catch (error) {
                console.log(error)
            }
            UpdateSubGredditReport();
        }
        const DeletePost = async () => {
            try {
                const data = await PostService.Delete(postid)
                console.log("recieved", data)
            }
            catch (error) {
                console.log(error)
            }
            DeleteReport();
        }
        DeletePost();
    }
    console.log("subgreddit now", subgreddit)
    // TODO: Check whether if working
    function HandleIgnore(id, ReportOn, ReportBy) {
        const IgnoreReport = async () => {
            try {
                const data = await ReportService.Ignore(id, {
                    from: (JSON.parse(window.localStorage.getItem('token'))).Email,
                    ReportedByEmail: ReportBy.Email,
                    ReportedOnUsername: ReportOn.Email
                })
                console.log("recieved", data)
                const finalreports = myreports.map(element => element._id === id ? { ...element, Ignored: true } : element)
                setmyreports(finalreports)
            }
            catch (error) {
                console.log(error)
            }
        }
        IgnoreReport();
    }
    function HandleBlock(ReportOn, ReportBy) {
        console.log("Here")
        console.log("block", ReportOn._id, ReportOn)
        if (!subgreddit.Blocked.map(element => element._id).includes(ReportOn._id)) {
            // TODO: Check whether if working
            const LeaveSubGreddiit = async () => {

                try {
                    const data = await SubGredditService.LeaveSubGreddit(params.id, { UserID: ReportOn._id })
                    console.log("recieved through Leave Subgreddit", data)
                    var updatedfollowers = subgreddit.Followers
                    updatedfollowers = updatedfollowers.filter(element => element._id !== ReportOn._id)
                    setsubgreddit({ ...subgreddit, Followers: updatedfollowers })
                }
                catch (error) {
                    console.log(error)
                }
            }
            const BlockUserRequest = async () => {
                try {
                    const data = await SubGredditService.BlockUser(params.id, {
                        UserID: ReportOn._id,
                        from: (JSON.parse(window.localStorage.getItem('token'))).Email,
                        ReportOnUsername: ReportOn.Username,
                        ReportedByUsername: ReportBy.Username,
                        ReportByEmail: ReportBy.Email,
                        ReportOnEmail: ReportOn.Email,
                        SubGredditName: subgreddit.Name
                    })
                    console.log("recieved through BlockUserRequest", data)
                    var updatedBlocked = subgreddit.Blocked
                    updatedBlocked = subgreddit.Blocked.concat(ReportOn)
                    setsubgreddit({ ...subgreddit, Blocked: updatedBlocked })
                    LeaveSubGreddiit();
                }
                catch (error) {
                    console.log(error)
                }

            }
            BlockUserRequest();
        }
        else {
            console.log("User is already blocked")
        }
    }
    const cumulativearray = []
    const cumulativemembers = membergrowthData.map((data, index) => {
        let members = 0;
        if (index === 0) {
            members = data.members;
            cumulativearray[0] = members
        } else {
            members = cumulativearray[index - 1] + data.members;
            cumulativearray[index] = members
        }
    })
    return (
        <div>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <div className="FollowerTabs">
                            <Tabs className="Tabs">
                                <TabList selectedIndex={currentTab} onSelect={setCurrentTab}>
                                    <Tab> USERS</Tab>
                                    <Tab> JOINING REQUESTS </Tab>
                                    <Tab> STATS</Tab>
                                    <Tab> REPORTED</Tab>
                                </TabList>
                                <TabPanel>
                                    <Box
                                        sx={{
                                            marginTop: 8,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <List
                                            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                            component="nav"
                                            aria-labelledby="nested-list-subheader"
                                            subheader={
                                                <ListSubheader component="div" id="nested-list-subheader">
                                                    Users
                                                </ListSubheader>
                                            }
                                        >
                                            <ListItemButton onClick={handleClick1}>
                                                <ListItemIcon>
                                                    <InboxIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Blocked" />
                                                {open1 ? <ExpandLess /> : <ExpandMore />}
                                            </ListItemButton>
                                            <Collapse in={open1} timeout="auto" unmountOnExit>
                                                {
                                                    subgreddit.Blocked.map(element => {
                                                        return (
                                                            <List component="div" disablePadding>
                                                                <ListItemButton sx={{ pl: 4 }}>
                                                                    <ListItemIcon>
                                                                        <PersonIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={element.Username} />
                                                                </ListItemButton>
                                                            </List>
                                                        )
                                                    })
                                                }
                                            </Collapse>
                                            <ListItemButton onClick={handleClick2}>
                                                <ListItemIcon>
                                                    <InboxIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="UnBlocked" />
                                                {open2 ? <ExpandLess /> : <ExpandMore />}
                                            </ListItemButton>
                                            <Collapse in={open2} timeout="auto" unmountOnExit>
                                                {
                                                    subgreddit.Followers.filter(element => ((!subgreddit.Blocked.length) || (!subgreddit.Blocked.map(element1 => element1._id).includes(element._id)))).map(element => {
                                                        return (
                                                            <List component="div" disablePadding>
                                                                <ListItemButton sx={{ pl: 4 }}>
                                                                    <ListItemIcon>
                                                                        <PersonIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={element.Username} />
                                                                </ListItemButton>
                                                            </List>
                                                        )
                                                    })
                                                }
                                            </Collapse>
                                        </List>
                                    </Box>
                                </TabPanel>
                                <TabPanel>
                                    <Box
                                        sx={{
                                            marginTop: 8,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {
                                            subgreddit.JoinRequests.map(element => {
                                                return (
                                                    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                                        <nav aria-label="main mailbox folders">
                                                            <List>
                                                                <ListItem >
                                                                    <ListItemIcon>
                                                                        <PersonIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={element.Username} />
                                                                    <Button onClick={event => handleAccept(subgreddit._id, element._id)} sx={{ marginLeft: 5 }} variant="contained" color="secondary">ACCEPT</Button>
                                                                    <Button onClick={event => handleReject(subgreddit._id, element._id)} sx={{ marginLeft: 5 }} variant="contained" color="secondary">REJECT</Button>
                                                                </ListItem>
                                                            </List>
                                                        </nav>
                                                        {/* <Divider /> */}
                                                    </Box>
                                                )
                                            })
                                        }
                                    </Box>
                                </TabPanel>
                                <TabPanel>
                                    <Box
                                        sx={{
                                            marginTop: 8,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <ChartPlot labels={postgrowthData.map((data, index, arr) => data.date)} title="Daily Posts" data={postgrowthData.map((data, index, arr) => data.posts)}></ChartPlot>
                                        <ChartPlot labels={["Reported Posts", "Deleted Posts"]} title="Reported Posts vs Deleted Posts" data={[subgreddit.Reported.length, subgreddit.Reported.length - subgreddit.Reports.length]}></ChartPlot>
                                        <ChartPlot labels={clickgrowthdata.map((data, index) => data.date)} title="Daily Clicks" data={clickgrowthdata.map((data, index) => data.clicks)}></ChartPlot>
                                        <ChartPlot labels={membergrowthData.map((data, index) => data.date)} title="Member Growth" data={cumulativearray}ChartPlot />
                                    </Box>
                                </TabPanel>
                                <TabPanel>
                                    {myreports.map(element => {
                                        return (
                                            <div>
                                                <Container component="main" sx={{ maxWidth: 500 }}>
                                                    <Card style={{ marginBottom: '20px' }} sx={{ marginTop: 8, bgcolor: green[500] }}>
                                                        <CardContent>
                                                            <Typography variant="h5" component="h2">
                                                                {element.By.Username}   on  {element.On.Username}
                                                            </Typography>
                                                            <Typography color="textSecondary" style={{ marginBottom: 12 }}>
                                                                {element.Concern}
                                                            </Typography>
                                                            <Typography variant="body2" component="p">
                                                                {element.Post.Text}
                                                            </Typography>
                                                            <div>
                                                                {
                                                                    element.Ignored ?
                                                                        <div>
                                                                            <Button disabled variant="contained" color="secondary">BLOCK USER</Button>
                                                                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                                                            <Button disabled variant="contained" color="secondary">DELETE POST</Button>
                                                                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                                                            <Button disabled variant="contained" color="secondary">IGNORE</Button>
                                                                        </div>
                                                                        :
                                                                        <div>
                                                                            {
                                                                                
                                                                            }
                                                                            <CancelButton HandleClick={() => HandleBlock(element.On, element.By)} />
                                                                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                                                            <Button onClick={() => HandleDeletePost(element.Post._id, element._id, element.On, element.By)} variant="contained" color="secondary">DELETE POST</Button>
                                                                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                                                            <Button onClick={() => HandleIgnore(element._id, element.On, element.By)} variant="contained" color="secondary">IGNORE</Button>
                                                                        </div>

                                                                }
                                                            </div>
                                                        </CardContent>
                                                    </Card >
                                                </Container>
                                            </div>
                                        )
                                    })
                                    }
                                </TabPanel>
                            </Tabs>
                        </div>
                    </Box>
                </Container>
            </ThemeProvider>
        </div>
    )
}
