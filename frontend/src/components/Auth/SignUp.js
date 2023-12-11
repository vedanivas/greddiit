import * as React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Root from "../../url"

export default function SignUp(props) {

  const [fname, setFname] = React.useState("")
  const [lname, setLname] = React.useState("")
  const [uname, setUname] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [age, setAge] = React.useState("")
  const [contact, setContact] = React.useState("")
  const [pswrd, setPswrd] = React.useState("")

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const info = {
      fname: data.get("firstName"),
      lname: data.get("lastName"),
      uname: data.get("uname"),
      email: data.get("email"),
      age: data.get("age"),
      contact: data.get("contact"),
      password: data.get("password")
    }

    try {
      const url = Root() + "/register"
      const config = { 'content-type': 'application/json' }
      console.log("Trying")
      const response = await axios.post(url, info, config)
      console.log(response.data);
      props.onSignUp(info)
    } catch (error) {
      console.error(error.response.data);
    }

  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="given-name"
            name="firstName"
            required
            fullWidth
            id="firstName"
            label="First Name"
            autoFocus
            onChange={(event) => { setFname(event.target.value) }}
            value={fname}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            onChange={(event) => { setLname(event.target.value) }}
            value={lname}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="uname"
            label="Username"
            name="uname"
            autoComplete="username"
            onChange={(event) => { setUname(event.target.value) }}
            value={uname}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={(event) => { setEmail(event.target.value) }}
            value={email}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            autoComplete="false"
            name="age"
            fullWidth
            id="age"
            label="Age"
            onChange={(event) => { setAge(event.target.value) }}
            value={age}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <TextField
            autoComplete="tel"
            name="contact"
            fullWidth
            id="contact"
            label="Contact"
            onChange={(event) => { setContact(event.target.value) }}
            value={contact}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            onChange={(event) => { setPswrd(event.target.value) }}
            value={pswrd}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={!((fname) && (lname) && (uname) && (email) && (age) && (contact) && (pswrd))}
      >
        Submit
      </Button>
    </Box>
  );
}