import * as React from 'react'
import { Navigate } from "react-router-dom"
import PopOut from "./PopOutList"
import PopOutForm from "./EditProfilePopOutForm"
import "./Profile.css"
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
})

export default function Profile() {

    const logStat = (window.localStorage.getItem("login-status") === "true")
    const details = JSON.parse(window.localStorage.getItem("user-details"))
    const [open, setOpen] = React.useState(true)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }

    if (!logStat) return <Navigate to="/" />
    else return (
        <div className="container">
            <Snackbar open={open} anchorOrigin={{ vertical: "top", horizontal: "center" }} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    <strong>{"Successfully logged in"}</strong>
                </Alert>
            </Snackbar>
            <main>
                {/* <div className="py-5 text-center">
      <img className="d-block mx-auto mb-4" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" />
      <h2>Checkout form</h2>
      <p className="lead">Below is an example form built entirely with Bootstrap’s form controls. Eachform group has a validation state that can be triggered by attempting to submit the form without completing it.</p>
    </div> */}

                <div className="row g-5 py-5">
                    <div className="col-md-5 col-lg-2 order-md-last">
                        <ul className="list-group mb-3">
                            <li className="list-group-item d-flex justify-content-between lh-sm">
                                <PopOut 
                                title="Followers"
                                user_id={details._id}
                                 />
                            </li>
                            <li className="list-group-item d-flex justify-content-between lh-sm">
                                <PopOut 
                                title="Following" 
                                user_id={details._id}
                                />
                            </li>
                        </ul>
                    </div>

                    <div className="col-md-7 col-lg-8">
                        <div className="row">
                            <div className="col-sm-6"><h4 className="mb-3">My Details</h4></div>
                            <div className="col-sm-6 text-end">
                                <PopOutForm />
                            </div>
                        </div>
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <label className="form-label">First name</label>
                                <input type="text" className="form-control" id="firstName" value={details.fname} readOnly={true} />
                            </div>

                            <div className="col-sm-6">
                                <label className="form-label">Last name</label>
                                <input type="text" className="form-control" id="lastName" value={details.lname} readOnly={true} />
                            </div>

                            <div className="col-12">
                                <label className="form-label">Username</label>
                                <div className="input-group">
                                    <span className="input-group-text">@</span>
                                    <input type="text" className="form-control" id="username" value={details.uname} readOnly={true} />
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" value={details.email} readOnly={true} />
                            </div>
                        </div>

                        <div className="row gy-3 py-3">
                            <div className="col-md-1">
                                <label className="form-label">Age</label>
                                <input type="text" className="form-control" id="cc-name" value={details.age} readOnly={true} />
                            </div>

                            <div className="col-md-5">
                                <label className="form-label">Contact</label>
                                <input type="text" className="form-control" id="contact" value={details.contact} readOnly={true} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Password</label>
                                <input type="text" className="form-control" id="password" value={details.password} readOnly={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}