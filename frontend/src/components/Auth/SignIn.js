import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Root from "../../url";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SignIn(props) {

  const [email, setEmail] = React.useState("")
  const [paswrd, setPaswrd] = React.useState("")

  const [open, setOpen] = React.useState(false);

  const [alertType, setAlertType] = React.useState("error")
  const [alertText, setAlertText] = React.useState("Incorrect Credentials")

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    // On clicking submit, the defualt behaviour of react is to reload the page. To prevent this, we use event.preventDefault()
    event.preventDefault();

    try {
      const url = Root() + "/login"
      const config = { 'content-type': 'application/json' }
      // Promise API
      const response = await axios.post(url, {fname: email, password: paswrd}, config)
      if (response.data.status === "ok"){
      setAlertType("success")
      setAlertText("Successfully logged in")

      props.onSignIn(response.data.details)
      }
      else {
        setEmail("")
        setPaswrd("")
      }
    }
    catch(error) {
      console.log(error.response.data)
    }
    setOpen(true)
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, justifyContent: "center" }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Username"
        name="email"
        autoComplete="email"
        autoFocus
        onChange={(event) => { setEmail(event.target.value) }}
        value={email}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        onChange={(event) => { setPaswrd(event.target.value) }}
        value={paswrd}
      />
      <Button 
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, justifyContent: "center" }}
        disabled={!((email) && (paswrd))}
      >
        Submit
      </Button>
      <Snackbar open={open} anchorOrigin={{ vertical: "top", horizontal: "center" }} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
          <strong>{alertText}</strong>
        </Alert>
      </Snackbar>
    </Box>
  );
}
