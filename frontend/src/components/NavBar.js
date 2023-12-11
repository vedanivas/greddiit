import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from "react-router-dom";
import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AppleIcon from '@mui/icons-material/Apple';


export default function NavBar(props) {
    const navigate = useNavigate()

    const logStat = (window.localStorage.getItem("login-status") === "true")

    return (
        <Navbar bg="light" variant="light" expand="lg">
            <Container fluid>
                <Navbar.Brand href="#">
                    <img
                        src="https://www.redditinc.com/assets/images/site/reddit-logo.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="reddit-logo"
                    />{" "}
                    greddiit
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="justify-content-end me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                    </Nav>

                    {logStat && <Nav
                        className="justify-content-end me-0 my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit" onClick={() => {navigate("/my-subgreddiits")}}>
                            {/* <Badge badgeContent={4} color="error"> */}
                                <MailIcon />
                            {/* </Badge> */}
                        </IconButton>

                        <IconButton size="large" aria-label="show 4 new mails" color="inherit" onClick={() => {navigate("/subgreddiits")}}>
                            {/* <Badge badgeContent={4} color="error"> */}
                                <NotificationsIcon />
                            {/* </Badge> */}
                        </IconButton>

                        <IconButton size="large" aria-label="show 4 new mails" color="inherit" onClick={() => {navigate("/saved-posts")}}>
                            {/* <Badge badgeContent={4} color="error"> */}
                                <AppleIcon/>
                            {/* </Badge> */}
                        </IconButton>

                        {/* <Nav.Link onClick={() => { navigate("/link-1") }}>Link 1</Nav.Link>
                        <Nav.Link onClick={() => { navigate("/link-2") }}>Link 2</Nav.Link> */}
                        <NavDropdown title=<img src="https://cdn-icons-png.flaticon.com/512/747/747376.png" width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="profile-logo" /> id="navbarScrollingDropdown" align={{ sm: 'end' }}>
                            <NavDropdown.Item onClick={() => { navigate("/profile") }}>Profile</NavDropdown.Item>
                            {/* <NavDropdown.Item href="#">My Subgreddiits</NavDropdown.Item>g */}
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={props.logOut}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>}

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}