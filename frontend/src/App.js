import * as React from 'react';
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Profile from "./components/Profile/Profile";
import NavBar from "./components/NavBar";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DisplayMySubgreddiit from './components/MySubgreddiits/DisplayMySubgreddiit';
import OpenMySubgreddiit from './components/MySubgreddiits/OpenMySubgreddiit'
import DisplaySubgreddiits from './components/AllSubgreddiits/DisplaySubgreddiits';
import OpenSubgreddiit from './components/AllSubgreddiits/OpenSubgreddiit';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SavedPosts from './components/SavedPosts';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
})

export default function App() {

  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)

  if (!window.localStorage.getItem("login-status")) window.localStorage.setItem("login-status", "false")

  const onLogOut = () => {
    window.localStorage.setItem("login-status", "false")
    window.localStorage.removeItem("user-details")
    navigate("/")
    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  }

  return (
    <>
      <NavBar logOut={onLogOut} />
      <Routes>
        {
          (window.localStorage.getItem("login-status") === "true")
            ?
            <>
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-subgreddiits" element={<DisplayMySubgreddiit />} />
              <Route path="/my-subgreddiits/:subgreddiitID" element={<OpenMySubgreddiit />} />
              <Route path="/subgreddiits" element={<DisplaySubgreddiits />} />
              <Route path="/subgreddiits/:subgreddiitID" element={<OpenSubgreddiit />} />
              <Route path="/saved-posts" element={<SavedPosts />} />
              <Route path="*" element={<Navigate to='/profile' />} />
            </>
            :
            <>
              <Route path="/" element={<Auth />} />
              <Route path="*" element={<Navigate to='/' />} />
            </>
        }
      </Routes>
      <Snackbar open={open} anchorOrigin={{ vertical: "top", horizontal: "center" }} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          <strong>{"Successfully logged out"}</strong>
        </Alert>
      </Snackbar>
    </>
  );
}
