import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button } from '@mui/material';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";
// import axios from 'axios';
import UserService from "../services/Users"
const theme = createTheme();
function validate(FirstName, LastName, Username, Email, Age, ContactNumber, password) {
    // true means invalid, so our conditions got reversed
    console.log("Age", Age, Age > 0)
    return {
        Email: Email.length === 0,
        password: password.length === 0,
        FirstName: FirstName.length === 0,
        LastName: LastName.length === 0,
        Age: Age <= 0,
        Username: Username.length === 0,
        ContactNumber: ContactNumber.length === 0
    };
}
const Notification = ({ message }) => {
    if (message === null) {
        return null
    }
    return (
        <div>
            <br />
            <div className='error'>
                {message}
            </div>
            <br />
        </div>
    )
}
export default function ViewProfile(props) {
    const [ReadOnlyValues, setReadOnlyValues] = React.useState({
        FirstName: "",
        LastName: "",
        Username: "",
        Email: "",
        Age: "",
        ContactNumber: "",
        Password: "",
        Followers: [],
        Following: []
    })
    const [errorMessage, setErrorMessage] = React.useState(null)
    const [FormValues, setFormValues] = React.useState({
        FirstName: "",
        LastName: "",
        Username: "",
        Email: "",
        Age: "",
        ContactNumber: "",
        password: ""
    })
    const [touched, settouched] = React.useState({
        FirstName: false,
        LastName: false,
        Username: false,
        Email: false,
        Age: false,
        ContactNumber: false,
        password: false
    })
    const [show1, setshow1] = React.useState(false)
    const [show2, setshow2] = React.useState(false)
    const [edit, setedit] = React.useState(false)
    const [showbuttons, setshowbuttons] = React.useState({
        showsavebutton: true,
        showcancelbutton: true,
        showeditbutton: true
    })
    const navigate = useNavigate()
    function canBeSubmitted() {
        const errors = validate(touched.FirstName, touched.LastName, touched.Username, touched.Email, touched.Age, touched.ContactNumber, touched.password);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return !isDisabled;
    }
    const errors = validate(FormValues.FirstName, FormValues.LastName, FormValues.Username, FormValues.Email, FormValues.Age, FormValues.ContactNumber, FormValues.password);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    const shouldMarkError = field => {
        const hasError = errors[field];
        const shouldShow = touched[field];
        return hasError ? shouldShow : false;
    };
    // TODO : const [errorMessage, setErrorMessage] = React.useState(null)
    function handleEdit() {
        setedit(!edit)
        setFormValues({
            ...FormValues, FirstName: "",
            LastName: "",
            Username: "",
            Email: "",
            Age: "",
            ContactNumber: "",
            password: ""
        })
    }
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // console.log("props user =", props.user)
                const data = await UserService.getID()
                console.log("recieved ReadOnlyValues", data)
                setReadOnlyValues({
                    FirstName: data.FirstName,
                    LastName: data.LastName,
                    Username: data.Username,
                    Email: data.Email,
                    Age: data.Age,
                    ContactNumber: data.ContactNumber,
                    Password: data.Password,
                    Following: data.Following,
                    Followers: data.Followers
                })
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, [])
    function handleSubmit(event) {
        event.preventDefault();
        if (!canBeSubmitted()) {
            setFormValues({
                FirstName: "",
                LastName: "",
                Username: "",
                Email: "",
                Age: "",
                ContactNumber: "",
                password: "",
            })
            setErrorMessage(
                `Given Form Inputs are Invalid `
            )
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000)
        }
        else {
            const UpdateProfile = async () => {
                setshowbuttons({ ...showbuttons, showcancelbutton: false, showeditbutton: false, showsavebutton: false })
                try {
                    console.log("props user for Update = ", props.user)
                    const data = await UserService.UpdateProfile(props.user.id, {
                        ...ReadOnlyValues,
                        ...FormValues
                    })
                    console.log("ReadOnlyValue", ReadOnlyValues)
                    console.log("recieved for Update", data)
                    setReadOnlyValues({
                        ...ReadOnlyValues,
                        ...FormValues
                    })
                    setFormValues({
                        ...FormValues, FirstName: "",
                        LastName: "",
                        Username: "",
                        Email: "",
                        Age: "",
                        ContactNumber: "",
                        password: ""
                    })
                }
                catch (error) {
                    console.log("In Register.js", error)
                }
                setshowbuttons({ ...showbuttons, showcancelbutton: true, showeditbutton: true, showsavebutton: true })
            }
            UpdateProfile();
            setedit(!edit)
            console.log(ReadOnlyValues)
        }
    }
    function Deleterow2(event, id) {
        console.log(id)
        const DeleteFollowers = async () => {
            try {
                // console.log("props user =", props.user)
                const data = await UserService.UpdateFollowers((JSON.parse(window.localStorage.getItem('token'))).id, { TargetID: id })
                console.log("recieved", data)
                setReadOnlyValues({ ...ReadOnlyValues, Followers: ReadOnlyValues.Followers.filter(element => element.id !== id) })
            }
            catch (error) {
                console.log(error)
            }
        }
        DeleteFollowers();
    }
    function Deleterow1(event, id) {
        console.log(id)
        const DeleteFollowing = async () => {
            try {
                // console.log("props user =", props.user)
                const data = await UserService.UpdateFollowing((JSON.parse(window.localStorage.getItem('token'))).id, { TargetID: id })
                console.log("recieved", data)
                setReadOnlyValues({ ...ReadOnlyValues, Following: ReadOnlyValues.Following.filter(element => element.id !== id) })
            }
            catch (error) {
                console.log(error)
            }
        }
        DeleteFollowing();
    }
    // console.log("Readonly values for Followers",ReadOnlyValues.Followers)
    // console.log("Readonly values for Following",ReadOnlyValues.Following)
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
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <AccountCircleIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            PROFILE
                        </Typography>
                        <Notification message={errorMessage} />
                        {edit ?
                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        {
                                            shouldMarkError("FirstName") ?
                                                <TextField
                                                    error
                                                    id="filled-error-helper-text"
                                                    helperText="Invalid entry"
                                                    onBlur={event => settouched({ ...touched, FirstName: true })}
                                                    autoComplete="given-name"
                                                    name="firstName"
                                                    required
                                                    fullWidth
                                                    label="FirstName"
                                                    autoFocus
                                                    variant="filled"
                                                    value={FormValues.FirstName}
                                                    onChange={event => setFormValues({ ...FormValues, FirstName: event.target.value })}
                                                />
                                                :
                                                <TextField
                                                    autoComplete="given-name"
                                                    name="firstName"
                                                    required
                                                    fullWidth
                                                    id="firstName"
                                                    label="FirstName"
                                                    autoFocus
                                                    value={FormValues.FirstName}
                                                    onBlur={event => settouched({ ...touched, FirstName: true })}
                                                    onChange={event => setFormValues({ ...FormValues, FirstName: event.target.value })}
                                                />
                                        }

                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {
                                            shouldMarkError("LastName") ?
                                                <TextField
                                                    error
                                                    id="filled-error-helper-text"
                                                    helperText="Invalid entry"
                                                    onBlur={event => settouched({ ...touched, LastName: true })}
                                                    required
                                                    fullWidth
                                                    label="Last Name"
                                                    name="lastName"
                                                    variant="filled"
                                                    value={FormValues.LastName}
                                                    onChange={event => setFormValues({ ...FormValues, LastName: event.target.value })}
                                                />
                                                :
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id="lastName"
                                                    label="Last Name"
                                                    name="lastName"
                                                    value={FormValues.LastName}
                                                    onBlur={event => settouched({ ...touched, LastName: true })}
                                                    onChange={event => setFormValues({ ...FormValues, LastName: event.target.value })}
                                                />
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        {
                                            shouldMarkError("Username") ?
                                                <TextField
                                                    error
                                                    id="filled-error-helper-text"
                                                    helperText="Invalid entry"
                                                    onBlur={event => settouched({ ...touched, Username: true })}
                                                    required
                                                    fullWidth
                                                    label="Username"
                                                    name="Username"
                                                    variant="filled"
                                                    value={FormValues.Username}
                                                    onChange={event => setFormValues({ ...FormValues, Username: event.target.value })}
                                                />
                                                :
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id="Username"
                                                    label="Username"
                                                    name="Username"
                                                    value={FormValues.Username}
                                                    onBlur={event => settouched({ ...touched, Username: true })}
                                                    onChange={event => setFormValues({ ...FormValues, Username: event.target.value })}
                                                />
                                        }
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {
                                            shouldMarkError("Age") ?
                                                <TextField
                                                    error
                                                    id="filled-error-helper-text"
                                                    helperText="Invalid entry"
                                                    onBlur={event => settouched({ ...touched, Age: true })}
                                                    required
                                                    label="Age"
                                                    type="number"
                                                    variant="filled"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    value={FormValues.Age}
                                                    onChange={event => setFormValues({ ...FormValues, Age: event.target.value })}
                                                />
                                                :
                                                <TextField
                                                    id="outlined-number"
                                                    required
                                                    label="Age"
                                                    type="number"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    value={FormValues.Age}
                                                    onBlur={event => settouched({ ...touched, Age: true })}
                                                    onChange={event => setFormValues({ ...FormValues, Age: event.target.value })}
                                                />
                                        }
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {
                                            shouldMarkError("ContactNumber") ?
                                                <TextField
                                                    variant="filled"
                                                    error
                                                    id="filled-error-helper-text"
                                                    helperText="Invalid entry"
                                                    onBlur={event => settouched({ ...touched, ContactNumber: true })}
                                                    value={FormValues.ContactNumber}
                                                    required
                                                    placeholder="Contact Number"
                                                    name="Contact Number"
                                                    inputStyle={{
                                                        background: "lightblue"
                                                    }}
                                                    onChange={event => setFormValues({ ...FormValues, ContactNumber: event.target.value })}
                                                />
                                                :
                                                <TextField
                                                    value={FormValues.ContactNumber}
                                                    required
                                                    placeholder="Contact Number"
                                                    name="Contact Number"
                                                    inputStyle={{
                                                        background: "lightblue"
                                                    }}
                                                    onBlur={event => settouched({ ...touched, ContactNumber: true })}
                                                    onChange={event => setFormValues({ ...FormValues, ContactNumber: event.target.value })}
                                                />
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        {
                                            shouldMarkError("Email") ?
                                                <TextField
                                                    variant="filled"
                                                    error
                                                    id="filled-error-helper-text"
                                                    helperText="Invalid entry"
                                                    onBlur={event => settouched({ ...touched, Email: true })}
                                                    required
                                                    fullWidth
                                                    label="Email Address"
                                                    name="email"
                                                    autoComplete="email"
                                                    value={FormValues.Email}
                                                    onChange={event => setFormValues({ ...FormValues, Email: event.target.value })}
                                                />
                                                :
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id="email"
                                                    label="Email Address"
                                                    name="email"
                                                    autoComplete="email"
                                                    value={FormValues.Email}
                                                    onBlur={event => settouched({ ...touched, Email: true })}
                                                    onChange={event => setFormValues({ ...FormValues, Email: event.target.value })}
                                                />
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        {
                                            shouldMarkError("password") ?
                                                <TextField
                                                    variant="filled"
                                                    error
                                                    id="filled-error-helper-text"
                                                    helperText="Invalid entry"
                                                    onBlur={event => settouched({ ...touched, password: true })}
                                                    required
                                                    fullWidth
                                                    name="password"
                                                    label="Password"
                                                    type="password"
                                                    autoComplete="new-password"
                                                    value={FormValues.password}
                                                    onChange={event => setFormValues({ ...FormValues, password: event.target.value })}
                                                />
                                                :
                                                <TextField
                                                    required
                                                    fullWidth
                                                    name="password"
                                                    label="Password"
                                                    type="password"
                                                    id="password"
                                                    autoComplete="new-password"
                                                    value={FormValues.password}
                                                    onBlur={event => settouched({ ...touched, password: true })}
                                                    onChange={event => setFormValues({ ...FormValues, password: event.target.value })}
                                                />
                                        }
                                    </Grid>
                                </Grid>
                                {
                                    isDisabled ?
                                        <Button fullWidth disabled sx={{ mt: 3, mb: 2 }}> Save Changes </Button>
                                        :
                                        showbuttons.showsavebutton ? <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            Save Changes
                                        </Button>
                                            :
                                            <Button fullWidth disabled sx={{ mt: 3, mb: 2 }}> Save Changes </Button>
                                }
                                {
                                    showbuttons.showcancelbutton ?
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                            onClick={handleEdit}
                                        >
                                            Cancel
                                        </Button>
                                        :
                                        <Button fullWidth disabled sx={{ mt: 3, mb: 2 }}> Cancel </Button>
                                }

                            </Box>
                            :
                            <Box component="form" sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            autoComplete="given-name"
                                            name="FirstName"
                                            fullWidth
                                            id="outlined-read-only-input"
                                            label="FirstName"
                                            autoFocus

                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            value={ReadOnlyValues.FirstName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            id="outlined-read-only-input"
                                            label="Last Name"
                                            name="LastName"

                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            value={ReadOnlyValues.LastName}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="outlined-read-only-input"
                                            label="Username"
                                            name="username"

                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            value={ReadOnlyValues.Username}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="outlined-number"
                                            required
                                            label="Age"
                                            type="number"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            name="age"

                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            value={ReadOnlyValues.Age}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField

                                            id="outlined-read-only-input"
                                            placeholder="Contact Number"
                                            name="Contact Number"
                                            inputstyle={{
                                                background: "lightblue"
                                            }}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            value={ReadOnlyValues.ContactNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="outlined-read-only-input"
                                            label="Email Address"
                                            name="Email"
                                            autoComplete="email"

                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            value={ReadOnlyValues.Email}
                                        />
                                    </Grid>
                                </Grid>
                                {
                                    showbuttons.showeditbutton ?
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                            onClick={handleEdit}
                                        >
                                            Edit
                                        </Button>
                                        :
                                        <Button fullWidth disabled sx={{ mt: 3, mb: 2 }}> Edit </Button>
                                }
                            </Box>
                        }

                        <div className="FollowerTabs">
                            <Tabs className="Tabs">
                                <TabList>
                                    <Tab>Following <Button variant="contained" color="secondary" onClick={() => setshow1(!show1)}>{ReadOnlyValues.Following.length}</Button></Tab>
                                    <Tab>Followers <Button variant="contained" color="secondary" onClick={() => setshow2(!show2)}>{ReadOnlyValues.Followers.length}</Button></Tab>
                                </TabList>
                                <TabPanel>
                                    {show1 ? <Box
                                        sx={{
                                            marginTop: 8,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Table sx={{ maxWidth: 125 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Username</TableCell>
                                                    <TableCell align="right">Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {ReadOnlyValues.Following.map(element => {
                                                    return (
                                                        <TableRow key={element.Username}>
                                                            <TableCell component="th" scope="row">
                                                                {element.Username}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Button variant="contained" color="secondary" onClick={(event) => Deleterow1(event, element._id)}>UNFOLLOW</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </Box> :
                                        <Box>
                                            <div>
                                                <br />
                                                <div className='error'>
                                                    {`Click on  ${ReadOnlyValues.Following.length} to View`}
                                                </div>
                                                <br />
                                            </div>
                                        </Box>
                                    }
                                </TabPanel>
                                <TabPanel>
                                    {show2 ? <Box
                                        sx={{
                                            marginTop: 8,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Table sx={{ maxWidth: 125 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Username</TableCell>
                                                    <TableCell align="right">Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {ReadOnlyValues.Followers.map(element => {
                                                    return (
                                                        <TableRow key={element.Username}>
                                                            <TableCell component="th" scope="row">
                                                                {element.Username}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Button variant="contained" color="secondary" onClick={(event) => Deleterow2(event, element._id)}>REMOVE</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </Box> :
                                        <Box>
                                            <div>
                                                <br />
                                                <div className='error'>
                                                    {`Click on  ${ReadOnlyValues.Followers.length} to View`}
                                                </div>
                                                <br />
                                            </div>
                                        </Box>}
                                </TabPanel>
                            </Tabs>
                        </div>
                    </Box>
                </Container>
            </ThemeProvider>
        </div>
    )
}