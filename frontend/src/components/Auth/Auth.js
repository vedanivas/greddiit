import { useNavigate } from "react-router-dom"
import { useState } from "react"
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import "./Auth.css"

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Greddiit
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

export default function Auth() {

    const navigate = useNavigate()
    const theme = createTheme()

    const [signState, setSignState] = useState(1)

    function onSignIn(data) {
        window.localStorage.setItem("login-status", "true")
        window.localStorage.setItem("user-details", JSON.stringify(data))
        navigate("/profile")
      }
    
      function onSignUp(data) {
        window.localStorage.setItem("login-status", "true")
        window.localStorage.setItem("user-details", JSON.stringify(data))
        navigate("/profile")
      }

    return (
        <>
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img src="https://www.redditinc.com/assets/images/site/reddit-logo.png" className="reddit-logo" alt="logo"></img>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Button fullWidth variant="contained" size="large" disabled={(signState === 1)} onClick={() => { setSignState(1) }}>
                                Sign In
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button fullWidth variant="contained" disabled={(signState === 2)} onClick={() => { setSignState(2) }}>
                                Sign Up
                            </Button>
                        </Grid>
                    </Grid>
                    {(signState === 1) ? <SignIn onSignIn={onSignIn} /> : <SignUp onSignUp={onSignUp} />}
                </Box>
            </Container>
        </ThemeProvider>
        <Copyright />
        </>
    )
}