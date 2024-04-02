import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css"
import Home from './components/Home';
import Navbar from "./components/Navbar"
import UserService from "./services/Users"
import Profile from "./components/Profile"
import MySubGreddits from "./components/MySubGreddits"
import OpenSubGreddits from "./components/OpenSubGreddits"
import SubGreddits from "./components/SubGreddits"
import ViewSubGreddits from "./components/ViewSubGreddits"
import SavedPosts from "./components/SavedPosts"

export default function App() {
  const [user, setuser] = React.useState(null)
  React.useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('token')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setuser(user)
      UserService.setToken(user.token)
    }
  }, [])
  return (
    <Router>
      <div className="container">
        <Navbar user={user} setuser={setuser} />
        <Routes>
          <Route exact path="/" element={!window.localStorage.getItem('token')? <Home user={user} setuser={setuser} />: <Navigate replace to="/profile" />}/>
          <Route path="/profile" element={window.localStorage.getItem('token') ? <Profile user={user} setuser={setuser} /> : <Navigate replace to="/" />} />
          <Route path="/MySubGreddits" element={window.localStorage.getItem('token') ? <MySubGreddits user={user} setuser={setuser} /> : <Navigate replace to="/" />} />
          <Route path="/OpenSubGreddits/:id" element={window.localStorage.getItem('token') ? <OpenSubGreddits user={user} setuser={setuser} /> : <Navigate replace to="/" />} />
          <Route path="/SubGreddits" element={window.localStorage.getItem('token') ? <SubGreddits user={user} setuser={setuser} /> : <Navigate replace to="/" />} />
          <Route path="/ViewSubGreddits/:id" element={window.localStorage.getItem('token') ? <ViewSubGreddits user={user} setuser={setuser} /> : <Navigate replace to="/" />} />
          <Route path="/SavedPosts" element={window.localStorage.getItem('token') ? <SavedPosts user={user} setuser={setuser} /> : <Navigate replace to="/" />} />
          <Route path="*" element={<Navigate replace to="/"/>} /> 
        </Routes>
      </div>
    </Router>
  );
}
